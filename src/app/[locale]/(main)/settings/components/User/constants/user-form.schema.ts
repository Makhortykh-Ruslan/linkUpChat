import { defaultRequiredRule, emailRule, idControl } from '@core/validations';
import { z } from 'zod';

export const userFormSchema = z.object({
  fullName: defaultRequiredRule,
  email: emailRule.min(1, 'required'),
  id: idControl,
});

export type TUserFormSchema = z.infer<typeof userFormSchema>;
