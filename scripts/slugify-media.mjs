import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIRECTORIES = [
  path.resolve(__dirname, '..', 'public', 'images', 'fondations'),
  path.resolve(__dirname, '..', 'public', 'images', 'dalle-beton'),
  path.resolve(__dirname, '..', 'public', 'images', 'murs-cloisons'),
  path.resolve(__dirname, '..', 'public', 'images', 'renovation'),
  path.resolve(__dirname, '..', 'public', 'images', 'etancheite-terrassement'),
  path.resolve(__dirname, '..', 'public', 'images', 'escalier'),
];

const DIACRITIC_REGEX = /\p{Diacritic}/gu;

function slugify(value) {
  const normalized = value
    .normalize('NFD')
    .replace(DIACRITIC_REGEX, '')
    .replace(/['’]/g, '')
    .replace(/&/g, 'et')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized.length > 0 ? normalized.toLowerCase() : 'media';
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectEntries(root, relative = '') {
  const dirPath = relative ? path.join(root, relative) : root;
  const dirents = await fs.readdir(dirPath, { withFileTypes: true });

  const files = [];
  const directories = [];

  for (const dirent of dirents) {
    const entryRelative = relative ? path.join(relative, dirent.name) : dirent.name;
    if (dirent.isDirectory()) {
      const nested = await collectEntries(root, entryRelative);
      files.push(...nested.files);
      directories.push(...nested.directories);
      directories.push(entryRelative);
    } else {
      files.push(entryRelative);
    }
  }

  return { files, directories };
}

async function renameFile(root, relativePath) {
  const dirRelative = path.dirname(relativePath);
  const filename = path.basename(relativePath);
  const extension = path.extname(filename);
  const baseName = path.basename(filename, extension);

  const slugBase = slugify(baseName);
  const normalizedExtension = extension.toLowerCase();

  const directoryPath = dirRelative === '.' ? root : path.join(root, dirRelative);
  const sourcePath = path.join(directoryPath, filename);

  let candidate = slugBase;
  let counter = 1;
  let targetName = `${candidate}${normalizedExtension}`;
  let targetPath = path.join(directoryPath, targetName);

  while (true) {
    const sameFile =
      targetName.toLowerCase() === filename.toLowerCase() &&
      targetPath.toLowerCase() === sourcePath.toLowerCase();

    if (sameFile) {
      break;
    }

    const exists = await fileExists(targetPath);
    if (!exists) {
      break;
    }

    counter += 1;
    candidate = `${slugBase}-${counter}`;
    targetName = `${candidate}${normalizedExtension}`;
    targetPath = path.join(directoryPath, targetName);
  }

  if (targetName === filename) {
    return;
  }

  await fs.rename(sourcePath, targetPath);
  console.log(`${path.join(dirRelative === '.' ? '' : dirRelative, filename)} -> ${targetName}`);
}

async function renameDirectory(root, relativePath) {
  const dirname = path.basename(relativePath);
  const parentRelative = path.dirname(relativePath);
  const parentPath = parentRelative === '.' ? root : path.join(root, parentRelative);

  const sourcePath = path.join(parentPath, dirname);
  const slugBase = slugify(dirname);

  let candidate = slugBase;
  let counter = 1;
  let targetName = candidate;
  let targetPath = path.join(parentPath, targetName);

  while (true) {
    const sameDirectory =
      targetName.toLowerCase() === dirname.toLowerCase() &&
      targetPath.toLowerCase() === sourcePath.toLowerCase();

    if (sameDirectory) {
      break;
    }

    const exists = await fileExists(targetPath);
    if (!exists) {
      break;
    }

    counter += 1;
    candidate = `${slugBase}-${counter}`;
    targetName = candidate;
    targetPath = path.join(parentPath, targetName);
  }

  if (targetName === dirname) {
    return;
  }

  await fs.rename(sourcePath, targetPath);
  console.log(`${relativePath} -> ${path.join(parentRelative === '.' ? '' : parentRelative, targetName)}`);
}

async function processRoot(root) {
  try {
    await fs.access(root);
  } catch {
    console.warn(`Le dossier ${root} est introuvable, passage...`);
    return;
  }

  const { files, directories } = await collectEntries(root);

  for (const file of files) {
    await renameFile(root, file);
  }

  const sortedDirectories = directories.sort((a, b) => b.split(path.sep).length - a.split(path.sep).length);
  for (const directory of sortedDirectories) {
    await renameDirectory(root, directory);
  }
}

async function main() {
  for (const directory of TARGET_DIRECTORIES) {
    console.log(`Normalisation des medias dans ${directory}...`);
    await processRoot(directory);
  }

  console.log('Normalisation terminee.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
