/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ems-blue': '#1e40af',
        'ems-red': '#dc2626',
        'ems-green': '#16a34a',
      }
    },
  },
  plugins: [],
}

