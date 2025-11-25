/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
         ration: { 
          green: '#16a34a',
          'green-hover': '#15803d',
          yellow: '#FDCD2F',
          'yellow-hover': '#F4C430',
          dark: '#12343A',
          'dark-hover': '#0F2A30',
        },
      },
    },
  },
  plugins: [],
}