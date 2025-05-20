import { useEffect, useState } from 'react';

/**
 * This component initializes the theme once on load to ensure
 * Flowbite picks up the correct theme from localStorage or system preference.
 * It handles dark mode initialization so theme state is consistent.
 */
export const ThemeInitializer = () => {
  // Run once on component mount
  useEffect(() => {
    // Get stored theme preference
    const storedTheme = localStorage.getItem('color-theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    // Set the theme based on stored preference or system default
    const themeMode = storedTheme || systemTheme;
    
    // Always start with a clean state
    document.documentElement.classList.remove('dark');
    
    // Only add dark class if theme is dark
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    }
    
    // Store the theme preference
    localStorage.setItem('color-theme', themeMode);
  }, []);

  // Return null as this is a utility component with no UI
  return null;
};

export default ThemeInitializer;