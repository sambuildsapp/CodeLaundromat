/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        'brand-clean': '#00d2ff',
        'brand-deep': '#003366',
        'brand-bg': '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        brand: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

