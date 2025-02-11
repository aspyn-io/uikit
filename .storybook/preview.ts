import "../src/index.css";

/** @type { import('@storybook/react').Preview } */
const preview = {
  backgrounds: {
    default: "light",
    values: [
      { name: "light", value: "#ffffff" },
      { name: "dark", value: "#1e1e1e" },
    ],
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
