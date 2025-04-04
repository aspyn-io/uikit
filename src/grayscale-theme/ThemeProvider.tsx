import React from "react";
import { ThemeProvider as FlowbiteThemeProvider } from "flowbite-react";
import { grayscaleTheme } from "./theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <FlowbiteThemeProvider theme={grayscaleTheme}>
      {children}
    </FlowbiteThemeProvider>
  );
};
