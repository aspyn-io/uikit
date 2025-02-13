const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./.storybook/**/*.{js,jsx,ts,tsx}",
    flowbite.content(),
  ],
  darkmode: "class",
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin()],
};
