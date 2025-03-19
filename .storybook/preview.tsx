import "../src/index.css";
import { Preview } from "@storybook/react";
import React from "react";

/** @type { import('@storybook/react').Preview } */
const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#1e1e1e" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === "#1e1e1e";
      document.documentElement.classList.toggle("dark", isDark);

      return (
        <div className={`${isDark ? "dark bg-gray-900" : "bg-white"}`}>
          <Story />
        </div>
      );
    },
  ],

  tags: ["autodocs"],
};

export default preview;
