import "../src/index.css";
import { Preview } from "@storybook/react";
import { withThemeByClassName } from '@storybook/addon-themes';
import React, { useEffect } from "react";

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
      // Force theme to be explicitly set from Storybook controls
      const isDark = context.globals.theme === 'dark';
      
      // Set initial theme state
      useEffect(() => {
        // First, force remove any dark class that might be set
        document.documentElement.classList.remove("dark");
        
        // Then only add it if explicitly dark
        if (isDark) {
          document.documentElement.classList.add("dark");
        }
        
        // Also set a data attribute that components can read
        document.documentElement.setAttribute('data-mode', isDark ? 'dark' : 'light');
        
        // Set localStorage to match current theme (to override Flowbite's stored preference)
        localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
      }, [isDark]);

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

export default preview;

export default preview;
