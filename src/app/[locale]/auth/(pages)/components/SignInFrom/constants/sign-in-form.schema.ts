import { emailRule, passwordRules } from '@core/validations';
import { z } from 'zod';

export const signInFormSchema = z.object({
  email: emailRule.min(1, 'required'),
  password: passwordRules.min(1, 'required'),
});

export type TSignInFormSchema = z.infer<typeof signInFormSchema>;
