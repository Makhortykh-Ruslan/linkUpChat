import { updatePasswordService } from '@core/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';

import {
  changePasswordFormSchema,
  type TChangePasswordFormSchema,
} from '../constants';

export const useChangePasswordForm = () => {
  const titles = useTranslations('titles');
  const labels = useTranslations('labels');
  const button = useTranslations('button');
  const validations = useTranslations('validations');
  const placeholders = useTranslations('placeholders');

  const translate = {
    titles,
    labels,
    button,
    validations,
    placeholders,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<TChangePasswordFormSchema>({
    resolver: zodResolver(changePasswordFormSchema),
    mode: 'onChange',
  });

  const [state, formAction, isPending] = useActionState(updatePasswordService, {
    success: false,
    data: null,
  });

  const onSubmit = ({
    oldPassword,
    newPassword,
  }: TChangePasswordFormSchema) => {
    startTransition(() =>
      formAction({
        newPassword,
        oldPassword,
      }),
    );
  };

  return {
    register,
    translate,
    errors,
    serverError: state.message,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: isPending || isSubmitting,
    isDisableSubmit: isPending || isSubmitting || !isValid || !isDirty,
  };
};
