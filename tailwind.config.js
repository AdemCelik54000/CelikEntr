/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Archivo', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand blue #003E8F: 10.4:1 with white text.
        brand: {
          DEFAULT: '#003E8F',
          dark: '#002B66',
          bright: '#1D5FC4',
          light: '#8DBBFF',
          soft: '#EAF1FB',
        },
        ink: '#0B1A30',
        mortar: '#F3F6FA',
      },
      maxWidth: {
        site: '76rem',
      },
    },
  },
  plugins: [],
};
