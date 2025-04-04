import defaultTheme from "tailwindcss/defaultTheme";
const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

// CAUTION: This file is exported to clients for shared configuration of tailwind css

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./.storybook/**/*.{js,jsx,ts,tsx}",
    ".flowbite-react/class-list.json"
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        body: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: [...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [flowbiteReact],
};