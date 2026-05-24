import type { TTheme } from '@core/types';
import type { ReactNode } from 'react';

export type ThemeProviderProps = {
  children: ReactNode;
  initialTheme: TTheme;
};
