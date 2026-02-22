import { z } from 'zod';

import {
  EMAIL_REGEXP,
  HAS_LOWERCASE,
  HAS_NUMBER,
  HAS_SYMBOL,
  HAS_UPPERCASE,
} from '@/src/core/constants';

export const idControl = z.string();

export const emailRule = z.string().regex(EMAIL_REGEXP, 'invalidEmail');

export const passwordRules = z
  .string()
  .min(8, 'passwordTooShort')
  .regex(HAS_UPPERCASE, 'passwordNoUppercase')
  .regex(HAS_LOWERCASE, 'passwordNoLowercase')
  .regex(HAS_NUMBER, 'passwordNoNumber')
  .regex(HAS_SYMBOL, 'passwordNoSymbol');

export const defaultRequiredRule = z.string().min(1, 'required');
