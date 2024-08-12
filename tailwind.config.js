/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust this path based on your project structure
  ],
  darkMode: 'class', // Enable dark mode support
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', // Dark blue
        gradientFrom: '#1e3a8a', // Start color for gradient
        gradientTo: '#2563eb', // End color for gradient
      },
      animation: {
        'background-move': 'backgroundMove 5s infinite linear',
        'spin-slow': 'spin 8s linear infinite', // Slow rotation
      },
      keyframes: {
        backgroundMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
