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
  datepicker: {
    root: {
      base: "relative",
    },
    popup: {
      root: {
        base: "absolute top-10 z-50 block pt-2",
        inline: "relative top-0 z-auto",
        inner:
          "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700",
      },
      header: {
        base: "",
        title:
          "px-2 py-3 text-center font-semibold text-gray-900 dark:text-white",
        selectors: {
          base: "mb-2 flex justify-between",
          button: {
            base: "rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
            prev: "",
            next: "",
            view: "",
          },
        },
      },
      view: {
        base: "p-1",
      },
      footer: {
        base: "mt-2 flex space-x-2",
        button: {
          base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-gray-300",
          today:
            "border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700",
          clear:
            "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
        },
      },
    },
    views: {
      days: {
        header: {
          base: "mb-1 grid grid-cols-7",
          title:
            "h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400",
        },
        items: {
          base: "grid w-64 grid-cols-7",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
            selected: "bg-gray-700 text-white hover:bg-gray-600",
            disabled: "text-gray-400",
          },
        },
      },
      months: {
        items: {
          base: "grid w-64 grid-cols-4",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
            selected: "bg-gray-700 text-white hover:bg-gray-600",
            disabled: "text-gray-500",
          },
        },
      },
      years: {
        items: {
          base: "grid w-64 grid-cols-4",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
            selected: "bg-gray-700 text-white hover:bg-gray-600",
            disabled: "text-gray-500",
          },
        },
      },
      decades: {
        items: {
          base: "grid w-64 grid-cols-4",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
            selected: "bg-gray-700 text-white hover:bg-gray-600",
            disabled: "text-gray-500",
          },
        },
      },
    },
  },
});
