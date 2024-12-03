/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
    colors:{
      "textBrand": "#040909",
      "backgroundBrand": "#fbfdfd",
      "primaryBrand":"#5fadae",
      "secondaryBrand":"#a9bcd4",
      "accentBrand":"#8492c1",
    }
  },
  plugins: [],
}

