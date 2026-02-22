import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import {
  changePasswordFormSchema,
  type TChangePasswordFormSchema,
} from '../constants';
import { useActionState } from 'react';
import { updateProfileInfoService } from '@/src/core/services';

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

  const [state, formAction, isPending] = useActionState(
    updateProfileInfoService,
    {
      success: false,
      data: null,
    },
  );

  const onSubmit = (data: TChangePasswordFormSchema) => {
    console.log('data', data);
  };

  return {
    register,
    translate,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: isPending || isSubmitting,
    isDisableSubmit: isPending || isSubmitting || !isValid || !isDirty,
  };
};
