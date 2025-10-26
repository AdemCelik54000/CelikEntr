import 'dotenv/config';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_SOURCE = path.resolve(__dirname, '..', 'public', 'images');
const DEFAULT_MANIFEST = path.resolve(__dirname, '..', 'src', 'data', 'media-manifest.json');
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg', 'heic', 'heif']);
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'ogg']);

function parseArgs(argv) {
  const args = {};

  for (const rawArg of argv) {
    if (!rawArg.startsWith('--')) {
      continue;
    }

    const withoutPrefix = rawArg.slice(2);
    const [key, value] = withoutPrefix.split('=');
    args[key] = value ?? 'true';
  }

  return args;
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/');
}

async function ensureDirectoryExists(filePath) {
  const directory = path.dirname(filePath);
  await fs.mkdir(directory, { recursive: true });
}

async function loadExistingManifest(manifestPath) {
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {
        version: 1,
        generatedAt: null,
        source: 'cloudinary',
        entries: {},
      };
    }
    throw error;
  }
}

function classifyExtension(extension) {
  if (IMAGE_EXTENSIONS.has(extension)) {
    return 'image';
  }

  if (VIDEO_EXTENSIONS.has(extension)) {
    return 'video';
  }

  return 'unsupported';
}

async function* walkDirectory(directory) {
  const dirents = await fs.readdir(directory, { withFileTypes: true });
  for (const dirent of dirents) {
    const absolute = path.join(directory, dirent.name);
    if (dirent.isDirectory()) {
      yield* walkDirectory(absolute);
    } else {
      yield absolute;
    }
  }
}

function resolveCloudFolder(base, relativeFolder) {
  if (!relativeFolder) {
    return base;
  }

  return `${base}/${toPosix(relativeFolder)}`;
}

async function uploadFile({ sourcePath, relativeFile, baseFolder, dryRun }) {
  const parsed = path.parse(relativeFile);
  const extension = parsed.ext.replace('.', '').toLowerCase();
  const classification = classifyExtension(extension);
  const folder = resolveCloudFolder(baseFolder, parsed.dir);

  if (classification === 'unsupported') {
    return {
      status: 'unsupported',
      extension,
      relativeFile,
      folder: parsed.dir,
    };
  }

  if (dryRun) {
    return {
      status: 'dry-run',
      kind: classification,
      extension,
      relativeFile,
      folder: parsed.dir,
      publicId: `${folder}/${parsed.name}`,
      url: `https://res.cloudinary.com/<cloud-name>/${classification}/upload/${folder}/${parsed.name}.${extension}`,
      bytes: 0,
    };
  }

  const uploadOptions =
    classification === 'video'
      ? { resource_type: 'video', folder }
      : { folder };

  const result = await cloudinary.uploader.upload(sourcePath, uploadOptions);

  return {
    status: 'uploaded',
    kind: classification,
    extension,
    relativeFile,
    folder: parsed.dir,
    publicId: result.public_id,
    url: result.secure_url,
    bytes: result.bytes ?? 0,
    width: result.width ?? null,
    height: result.height ?? null,
  };
}

function upsertManifestEntry(manifest, relativeFolder) {
  const key = toPosix(relativeFolder || '');
  if (!manifest.entries[key]) {
    manifest.entries[key] = {
      media: [],
      hasUnsupportedMedia: false,
      unsupportedExtensions: [],
    };
  }

  return manifest.entries[key];
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const sourceRoot = path.resolve(args.source ?? DEFAULT_SOURCE);
  const manifestPath = path.resolve(args.manifest ?? DEFAULT_MANIFEST);
  const cloudFolder = args.folder ?? 'celik-portfolio';
  const dryRun = args['dry-run'] === 'true';

  if (!dryRun) {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      console.error(
        'Veuillez définir les variables CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET.'
      );
      process.exit(1);
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  console.log(`Source media : ${sourceRoot}`);
  console.log(`Dossier Cloudinary de destination : ${cloudFolder}`);
  console.log(dryRun ? 'Mode simulation (aucun upload effectif).' : 'Mode upload effectif vers Cloudinary.');

  const manifest = await loadExistingManifest(manifestPath);
  manifest.version = 1;
  manifest.source = dryRun ? 'dry-run' : 'cloudinary';
  manifest.generatedAt = new Date().toISOString();

  let processed = 0;
  let uploaded = 0;
  let unsupported = 0;

  for await (const absolutePath of walkDirectory(sourceRoot)) {
    const relative = path.relative(sourceRoot, absolutePath);
    const relativePosix = toPosix(relative);
    processed += 1;

    console.log(`• Traitement : ${relativePosix}`);
    try {
      const result = await uploadFile({
        sourcePath: absolutePath,
        relativeFile: relative,
        baseFolder: cloudFolder,
        dryRun,
      });

      const folderEntry = upsertManifestEntry(manifest, path.dirname(relative));

      if (result.status === 'unsupported') {
        folderEntry.hasUnsupportedMedia = true;
        if (!folderEntry.unsupportedExtensions.includes(result.extension)) {
          folderEntry.unsupportedExtensions.push(result.extension);
        }
        unsupported += 1;
        console.warn(`  ⭕ Extension non supportée: ${result.extension}`);
        continue;
      }

      folderEntry.media = folderEntry.media.filter((item) => item.relativePath !== relativePosix);
      folderEntry.media.push({
        name: path.basename(relative, path.extname(relative)),
        extension: result.extension,
        kind: result.kind,
        url: result.url,
        publicId: result.publicId,
        relativePath: relativePosix,
        bytes: result.bytes ?? null,
        width: result.width ?? null,
        height: result.height ?? null,
      });

      uploaded += result.status === 'uploaded' ? 1 : 0;
      console.log(`  ✅ ${dryRun ? 'Simulé' : 'Uploadé'} -> ${result.url}`);
    } catch (error) {
      console.error(`  ❌ Erreur: ${error.message}`);
    }
  }

  Object.values(manifest.entries).forEach((entry) => {
    entry.media.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
    entry.unsupportedExtensions.sort();
  });

  await ensureDirectoryExists(manifestPath);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log('');
  console.log('Résumé :');
  console.log(`  Fichiers traités        : ${processed}`);
  console.log(`  Uploads réalisés        : ${uploaded}`);
  console.log(`  Extensions non supportées : ${unsupported}`);
  console.log(`Manifest mis à jour dans  : ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
