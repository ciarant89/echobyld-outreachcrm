/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:   '#000000',
          dark:    '#33533D',
          mid:     '#60866C',
          light:   '#ADCCB7',
          white:   '#FFFFFF',
          surface: '#F4F7F5',
          border:  '#D4E0D8',
          text:    '#0D1F12',
          muted:   '#4A6352',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

