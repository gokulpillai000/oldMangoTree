/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#e5d0cb',
          300: '#d4afb0',
          400: '#c27e85',
          500: '#a84c57',
          600: '#8f3844',
          700: '#752b36',
          800: '#61262f',
          900: '#52242b',
          950: '#2d0e13',
        },
        paper: {
          light: '#fbf9f5',
          dark: '#121212',
          card: '#ffffff',
          cardDark: '#1e1e1e',
        }
      },
      fontFamily: {
        sans: ['DzainTrueCopy', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['DzainTrueCopy', 'Georgia', 'Cambria', 'serif'],
        text: ['"Dzain-TrueCopy Text"', 'DzainTrueCopy', 'Georgia', 'serif'],
        inline: ['"DzainTrueCopy Inline"', 'DzainTrueCopy', 'sans-serif'],
        ml: ['DzainTrueCopy', '"Dzain-TrueCopy Text"', 'Noto Sans Malayalam', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
