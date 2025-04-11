import { createTheme } from "flowbite-react";

export const grayscaleTheme = createTheme({
  accordion: {
    root: {
      base: "divide-y divide-gray-200 border-gray-200 dark:divide-gray-700 dark:border-gray-700",
    },
  },
  alert: {
    color: {
      gray: "text-gray-800 bg-gray-100 border-gray-200",
    },
  },
  badge: {
    root: {
      color: {
        gray: "bg-gray-700 text-white",
      },
    },
  },
  button: {
    color: {
      gray: "text-white bg-gray-700 hover:bg-gray-800 focus:ring-gray-300",
    },
  },
  card: {
    root: {
      base: "flex rounded-lg border border-gray-200 bg-white shadow dark:border-gray-600 dark:bg-gray-800",
    },
  },
  dropdown: {
    floating: {
      base: "z-10 w-fit rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-600 dark:bg-gray-700",
    },
  },
  modal: {
    root: {
      base: "relative h-full w-full p-4 md:h-auto",
      show: {
        on: "flex bg-black/50 dark:bg-black/50",
        off: "hidden",
      },
    },
    body: {
      base: "p-6 pt-0",
    },
  },
  navbar: {
    root: {
      base: "fixed z-30 w-full border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800",
    },
  },
  sidebar: {
    root: {
      base: "h-full border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
    },
  },
  table: {
    root: {
      base: "w-full text-left text-sm text-gray-500 dark:text-gray-400",
    },
    head: {
      base: "bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400",
    },
    row: {
      base: "border-b border-gray-200 dark:border-gray-700",
    },
  },
});
