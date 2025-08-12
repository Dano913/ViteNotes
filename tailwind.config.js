/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Agregar la fuente redonda personalizada
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

