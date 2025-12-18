/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nei-nav': '#2d3748',
        'nei-gap': '#1a202c',
        'nei-recipe': '#4a5568',
        'nei-search': '#718096',
      },
    },
  },
  plugins: [],
}
