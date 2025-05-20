import React from "react";
import { ThemeProvider as FlowbiteThemeProvider } from "flowbite-react";
import { grayscaleTheme } from "./theme";
import { ThemeInitializer } from "./ThemeInitializer";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <FlowbiteThemeProvider theme={grayscaleTheme}>
      <ThemeInitializer />
      {children}
    </FlowbiteThemeProvider>
  );
};
