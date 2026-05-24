'use client';

import type { TTheme } from '@core/types';
import { createContext, useContext, useState } from 'react';

import { DEFAULT_THEME_CONTEXT } from './constants';
import type { ThemeContextType, ThemeProviderProps } from './types';

const ThemeContextInstance = createContext<ThemeContextType>(
  DEFAULT_THEME_CONTEXT,
);

export const ThemeProvider = ({
  children,
  initialTheme,
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<TTheme>(initialTheme);

  const changeTheme = (theme: TTheme) => {
    document.documentElement.className = theme;
    setTheme(theme);
  };

  return (
    <ThemeContextInstance.Provider value={{ changeTheme, theme }}>
      {children}
    </ThemeContextInstance.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContextInstance);

  if (!context) {
    throw new Error('ThemeContext must be used within a ThemeProvider');
  }

  return context;
};
