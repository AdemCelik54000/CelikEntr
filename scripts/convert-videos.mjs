import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEDIA_ROOT = path.resolve(__dirname, '..', 'public', 'images');
const SOURCE_EXTENSIONS = new Set(['.mov', '.MOV', '.m4v', '.M4V']);
const TARGET_EXTENSION = '.mp4';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function findSourceVideos(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const dirent of dirents) {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      files.push(...(await findSourceVideos(fullPath)));
      continue;
    }

    const extension = path.extname(dirent.name);
    if (SOURCE_EXTENSIONS.has(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function convertVideo(sourcePath) {
  const parsed = path.parse(sourcePath);
  const targetPath = path.join(parsed.dir, `${parsed.name}${TARGET_EXTENSION}`);

  if (await fileExists(targetPath)) {
    console.log(`  • ${sourcePath} ignoré (cible déjà présente)`);
    return { source: sourcePath, target: targetPath, skipped: true };
  }

  await new Promise((resolve, reject) => {
    ffmpeg(sourcePath)
      .outputOptions('-movflags +faststart')
      .videoCodec('libx264')
      .audioCodec('aac')
      .output(targetPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  await fs.unlink(sourcePath);
  return { source: sourcePath, target: targetPath, skipped: false };
}

async function main() {
  try {
    await fs.access(MEDIA_ROOT);
  } catch {
    console.error(`Le dossier ${MEDIA_ROOT} est introuvable.`);
    process.exit(1);
  }

  const sourceVideos = await findSourceVideos(MEDIA_ROOT);
  if (sourceVideos.length === 0) {
    console.log('Aucune vidéo à convertir.');
    return;
  }

  console.log(`Conversion de ${sourceVideos.length} vidéo(s) vers ${TARGET_EXTENSION}...`);

  const results = [];
  for (const [index, file] of sourceVideos.entries()) {
    process.stdout.write(`  [${index + 1}/${sourceVideos.length}] ${file} ...`);
    try {
      const result = await convertVideo(file);
      results.push(result);
      process.stdout.write(result.skipped ? ' ignorée\n' : ' OK\n');
    } catch (error) {
      process.stdout.write(' ÉCHEC\n');
      console.error(error);
    }
  }

  if (results.some((item) => !item.skipped)) {
    console.log('Conversion terminée.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
