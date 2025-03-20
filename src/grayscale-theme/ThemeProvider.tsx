import React from 'react';
import { Flowbite, ThemeProps } from 'flowbite-react';
import { grayscaleTheme } from './theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <Flowbite theme={{ theme: grayscaleTheme }}>
      {children}
    </Flowbite>
  );
}; 
