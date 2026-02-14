/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navbar: "#f4f4f4",
        primaryBrown: "#8B5E3C",
        brownHover: "#A47148",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
};
