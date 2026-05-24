import type { InputHTMLAttributes } from 'react';

import type { TIcon } from '@/src/core/types';

export type TInputProps = {
  id: string;
  label?: string;
  error?: string;
  className?: string;
  leftIcon?: TIcon;
  rightIcon?: TIcon;
  isPasswordFlow?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;
