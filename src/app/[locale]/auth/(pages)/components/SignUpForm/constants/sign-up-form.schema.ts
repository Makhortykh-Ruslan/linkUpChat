import { z } from 'zod';

import {
  defaultRequiredRule,
  emailRule,
  passwordRules,
} from '@/src/core/validations';

export const signUpFormSchema = z
  .object({
    fullName: defaultRequiredRule,
    email: emailRule.min(1, 'required'),
    password: passwordRules,
    confirmPassword: defaultRequiredRule,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwordsDontMatch',
    path: ['confirmPassword'],
  });

export type TSignIUpFormSchema = z.infer<typeof signUpFormSchema>;
