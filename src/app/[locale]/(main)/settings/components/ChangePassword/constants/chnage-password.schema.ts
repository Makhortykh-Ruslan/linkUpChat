import { passwordRules } from '@core/validations';
import { z } from 'zod';

export const changePasswordFormSchema = z
  .object({
    oldPassword: passwordRules,
    newPassword: passwordRules,
    confirmNewPassword: passwordRules,
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'newPasswordMustBeDifferent',
    path: ['newPassword'],
  })
  .refine((data) => data.oldPassword !== data.confirmNewPassword, {
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
