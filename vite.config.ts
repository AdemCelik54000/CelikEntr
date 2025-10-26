import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  assetsInclude: [
    '**/*.heic',
    '**/*.HEIC',
    '**/*.heif',
    '**/*.HEIF',
    '**/*.jpg',
    '**/*.JPG',
    '**/*.jpeg',
    '**/*.JPEG',
    '**/*.png',
    '**/*.PNG',
    '**/*.webp',
    '**/*.WEBP',
    '**/*.avif',
    '**/*.AVIF',
    '**/*.gif',
    '**/*.GIF',
    '**/*.svg',
    '**/*.SVG',
    '**/*.mov',
    '**/*.MOV',
    '**/*.mp4',
    '**/*.MP4',
    '**/*.webm',
    '**/*.WEBM',
    '**/*.ogg',
    '**/*.OGG',
  ],
});
