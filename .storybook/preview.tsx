import React from "react";
import type { Preview } from "@storybook/react";
import { Flowbite } from "flowbite-react";
import theme from "../src/flowbite-theme";
import "../src/index.css"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    (Story) => (
      <Flowbite theme={{theme}}>
        <Story />
      </Flowbite>
    ),
  ],
};

export default preview;
