/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'purple-light': '#CAB7FF',
        'purple-dark': '#7C4DFF',
        'gray': '#D9D9D9'
      },
      fontFamily: {
        Inter: ['Inter', 'sans-serif'],
        Lexend: ['Lexend', 'sans-serif'],
        Poppins: ['Poppins', 'sans-serif'],
      },
      transitionProperty: {
        "height": "height",
        "width": "width"
      }
    },
  },
  plugins: [],
})