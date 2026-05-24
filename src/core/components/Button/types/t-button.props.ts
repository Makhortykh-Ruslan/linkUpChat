import type { ButtonHTMLAttributes, ReactNode } from 'react';

import type { TBtnColor } from './t-btn-color';

export type TButtonProps = {
  color?: TBtnColor;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;
