/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050c1a',
          900: '#070f22',
          800: '#0d1b35',
          700: '#122248',
          600: '#1a2f5e',
        },
        slate: {
          700: '#1e2d45',
          600: '#253553',
          500: '#2e4068',
          400: '#4a6080',
          300: '#6b87a8',
          200: '#8fa6c0',
          100: '#b8ccde',
        },
        cyan: {
          500: '#00e5ff',
          400: '#1aecff',
          300: '#5ef2ff',
          200: '#a0f5ff',
        },
        emerald: '#00d68f',
        amber: '#f5a623',
        crimson: '#ff4757',
        violet: '#a855f7',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
