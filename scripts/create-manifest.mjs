import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_SOURCE = path.resolve(__dirname, '..', 'public', 'images');
const DEFAULT_DESTINATION = path.resolve(__dirname, '..', 'src', 'data', 'media-manifest.json');

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg', 'heic', 'heif']);
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'ogg']);

function classify(extension) {
  if (IMAGE_EXTENSIONS.has(extension)) {
    return 'image';
  }

  if (VIDEO_EXTENSIONS.has(extension)) {
    return 'video';
  }

  return 'unsupported';
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/');
}

async function* walk(directory) {
  const dirents = await fs.readdir(directory, { withFileTypes: true });
  for (const dirent of dirents) {
    const absolute = path.join(directory, dirent.name);
    if (dirent.isDirectory()) {
      yield* walk(absolute);
    } else {
      yield absolute;
    }
  }
}

async function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  const [sourceArg, destinationArg] = process.argv.slice(2);
  const sourceRoot = path.resolve(sourceArg ?? DEFAULT_SOURCE);
  const manifestPath = path.resolve(destinationArg ?? DEFAULT_DESTINATION);

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: 'local',
    entries: {},
  };

  let processed = 0;
  let unsupported = 0;

  for await (const absolutePath of walk(sourceRoot)) {
    const relative = path.relative(sourceRoot, absolutePath);
    const relativePosix = toPosix(relative);
    const parsed = path.parse(relative);
    const extension = parsed.ext.replace('.', '').toLowerCase();
    const kind = classify(extension);
    processed += 1;

    const folderKey = toPosix(parsed.dir || '');
    if (!manifest.entries[folderKey]) {
      manifest.entries[folderKey] = {
        media: [],
        hasUnsupportedMedia: false,
        unsupportedExtensions: [],
      };
    }

    if (kind === 'unsupported') {
      manifest.entries[folderKey].hasUnsupportedMedia = true;
      if (!manifest.entries[folderKey].unsupportedExtensions.includes(extension)) {
        manifest.entries[folderKey].unsupportedExtensions.push(extension);
      }
      unsupported += 1;
      continue;
    }

    manifest.entries[folderKey].media.push({
      name: parsed.name,
      extension,
      kind,
      url: `/images/${relativePosix}`,
      relativePath: relativePosix,
      publicId: null,
      bytes: null,
      width: null,
      height: null,
    });
  }

  Object.values(manifest.entries).forEach((entry) => {
    entry.media.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
    entry.unsupportedExtensions.sort();
  });

  await ensureDirExists(manifestPath);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`Manifest généré dans ${manifestPath}`);
  console.log(`Fichiers analysés : ${processed}`);
  console.log(`Extensions ignorées : ${unsupported}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
