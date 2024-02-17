/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...require("tailwindcss/defaultTheme").fontFamily.sans],
      },
    },
  },
  plugins: [],
};
