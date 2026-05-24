import type { TTheme } from '@core/types';

export type ThemeContextType = {
  theme: TTheme;
  changeTheme: (theme: TTheme) => void;
};
