import "../src/index.css";
import { Preview } from "@storybook/react";
import { withThemeByClassName } from '@storybook/addon-themes';
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
    themes: {
      default: 'light',
      list: [
        { name: 'light', class: '', color: '#FFFFFF' },
        { name: 'dark', class: 'dark', color: '#1e1e1e' },
      ],
    },
  },

  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story, context) => {
      const isDark = context.globals.theme === 'dark';
      document.documentElement.classList.toggle("dark", isDark);

      return (
        <div className={`${isDark ? "dark bg-gray-900" : "bg-white"} p-4`}>
          <Story />
        </div>
      );
    },
  ],

  tags: ["autodocs"],
};

export default preview;
