import {
  defaultRequiredRule,
  emailRule,
  passwordRules,
} from '@core/validations';
import { z } from 'zod';

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
