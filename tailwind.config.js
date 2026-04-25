/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37', // Gold
          light: '#FFD700',
          dark: '#996515',
        },
        secondary: {
          DEFAULT: '#00BFFF', // Sky Blue
          light: '#87CEEB',
          dark: '#008B8B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#F8F9FA',
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#F1F3F5',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 10px 30px -10px rgba(212, 175, 55, 0.3)',
        'blue': '0 10px 30px -10px rgba(0, 191, 255, 0.3)',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
