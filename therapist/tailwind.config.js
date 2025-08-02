/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f7f6',
          100: '#b3ecea',
          200: '#80dfdc',
          300: '#4dd1ce',
          400: '#26c7c4',
          500: '#009490',
          600: '#007b78',
          700: '#00615f',
          800: '#004744',
          900: '#002f2c',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.2s ease-in-out',
        'fadeOut': 'fadeOut 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}