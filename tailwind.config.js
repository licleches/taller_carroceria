/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e6f7ef",
          100: "#b3e6cc",
          200: "#80d4a9",
          300: "#4dc286",
          400: "#26b06b",
          500: "#009e52",
          600: "#006837",
          700: "#005a2e",
          800: "#004c25",
          900: "#003d1d",
        },
      },
    },
  },
  plugins: [],
}
