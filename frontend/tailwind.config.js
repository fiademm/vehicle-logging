/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#087f5b',
        accent1: '#36a67c',
        accent2: '#FFC107',
        neutralLight: '#F8F8F8',
        neutralMedium: '#E0E0E0',
        textDark: '#333333',
        textLight: '#666666',
        white: '#FFFFFF',
        black: '#000000',
      },
    },
  },
  plugins: [],
}