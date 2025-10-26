import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import heicConvert from 'heic-convert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_ROOT = path.resolve(__dirname, '..', 'public', 'images');
const SUPPORTED_TARGET_EXTENSION = '.jpg';

const HEIC_EXTENSIONS = new Set(['.heic', '.heif']);

async function findHeicFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const dirent of dirents) {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      files.push(...(await findHeicFiles(fullPath)));
      continue;
    }

    const ext = path.extname(dirent.name).toLowerCase();
    if (HEIC_EXTENSIONS.has(ext)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function convertFile(filePath) {
  const targetPath = filePath.replace(/\.(heic|heif)$/i, SUPPORTED_TARGET_EXTENSION);

  const inputBuffer = await fs.readFile(filePath);
  const outputBuffer = await heicConvert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 0.9,
  });

  await fs.writeFile(targetPath, outputBuffer);
  await fs.unlink(filePath);

  return { source: filePath, target: targetPath };
}

async function main() {
  try {
    await fs.access(IMAGES_ROOT);
  } catch {
    console.error(`Le dossier ${IMAGES_ROOT} est introuvable.`);
    process.exit(1);
  }

  const heicFiles = await findHeicFiles(IMAGES_ROOT);

  if (heicFiles.length === 0) {
    console.log('Aucun fichier HEIC/HEIF trouvé.');
    return;
  }

  console.log(`Conversion de ${heicFiles.length} fichier(s) HEIC/HEIF vers ${SUPPORTED_TARGET_EXTENSION}...`);

  const results = [];
  for (const [index, file] of heicFiles.entries()) {
    process.stdout.write(`  [${index + 1}/${heicFiles.length}] ${file} ...`);
    try {
      const conversionResult = await convertFile(file);
      results.push(conversionResult);
      process.stdout.write(' OK\n');
    } catch (error) {
      process.stdout.write(' ÉCHEC\n');
      console.error(error);
    }
  }

  console.log('Conversion terminée.');
  console.log(
    results
      .map((res) => `  - ${res.source} → ${res.target}`)
      .join('\n')
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
