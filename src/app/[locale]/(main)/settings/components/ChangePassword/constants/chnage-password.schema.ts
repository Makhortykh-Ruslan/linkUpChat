import { z } from 'zod';

import { passwordRules } from '@/src/core/validations';

export const changePasswordFormSchema = z
  .object({
    password: passwordRules,
    newPassword: passwordRules,
    confirmNewPassword: passwordRules,
  })
  .refine((data) => data.password !== data.newPassword, {
    message: 'newPasswordMustBeDifferent',
    path: ['newPassword'],
  })
  .refine((data) => data.password !== data.confirmNewPassword, {
    message: 'newPasswordMustBeDifferent',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'passwordsDontMatch',
    path: ['confirmNewPassword'],
  });

export type TChangePasswordFormSchema = z.infer<
  typeof changePasswordFormSchema
>;
