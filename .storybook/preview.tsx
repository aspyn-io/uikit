import "../src/index.css";
import { Preview } from "@storybook/react-vite";
import React from "react";
import { ThemeProvider } from "../src/grayscale-theme/ThemeProvider";

/** @type { import('@storybook/react-vite').Preview } */
const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        light: { name: "light", value: "#ffffff" },
        dark: { name: "dark", value: "#1e1e1e" }
      }
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
        <ThemeProvider>
          <div className={`${isDark ? "dark bg-gray-900" : "bg-white"}`}>
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],

  tags: ["autodocs"],

  initialGlobals: {
    backgrounds: {
      value: "light"
    }
  }
};

export default preview;
