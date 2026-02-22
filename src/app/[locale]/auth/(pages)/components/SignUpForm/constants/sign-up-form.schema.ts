import { z } from 'zod';

import {
  defaultRequiredRule,
  emailRule,
  passwordRules,
} from '@/src/core/validations';

export const signUpFormSchema = z.object({
  fullName: defaultRequiredRule,
  email: emailRule.min(1, 'required'),
  password: passwordRules,
});

export type TSignIUpFormSchema = z.infer<typeof signUpFormSchema>;
