/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lodge: {
          pine: '#1f4d2e',
          felt: '#1e3a2a',
          lake: '#2b6f87',
          wood: '#8b5e3c',
          canvas: '#e5dccd',
        },
      },
      fontFamily: {
        ui: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Noto Sans', 'sans-serif'],
      },
      backgroundImage: {
        'wood-texture': 'radial-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0))',
      },
    },
  },
  darkMode: 'media',
  plugins: [],
};


