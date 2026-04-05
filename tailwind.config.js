/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3f9',
          100: '#d9e0ef',
          200: '#b3c1df',
          300: '#8da2cf',
          400: '#6783bf',
          500: '#4164af',
          600: '#34508c',
          700: '#273c69',
          800: '#1a2846',
          900: '#0d1423',
          950: '#070a11',
        },
        gold: {
          50: '#fdf9ef',
          100: '#faf0d5',
          200: '#f4e0ab',
          300: '#edd080',
          400: '#e7c056',
          500: '#D4A843',
          600: '#b8862a',
          700: '#8c6520',
          800: '#604516',
          900: '#34250c',
        },
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7d7fe',
          500: '#3b5bdb',
          600: '#364fc7',
          700: '#2b44a8',
          800: '#1e3a8a',
          900: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // 🟢 ADD THIS LINE
  ],
}
