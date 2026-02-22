import { z } from 'zod';

import { emailRule, passwordRules } from '@/src/core/validations';

export const signInFormSchema = z.object({
  email: emailRule.min(1, 'required'),
  password: passwordRules.min(1, 'required'),
});

export type TSignInFormSchema = z.infer<typeof signInFormSchema>;
