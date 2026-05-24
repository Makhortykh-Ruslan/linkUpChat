import type { TIcon } from '@core/types';
import type { InputHTMLAttributes } from 'react';

export type TInputProps = {
  id: string;
  label?: string;
  error?: string;
  className?: string;
  leftIcon?: TIcon;
  rightIcon?: TIcon;
  isPasswordFlow?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;
