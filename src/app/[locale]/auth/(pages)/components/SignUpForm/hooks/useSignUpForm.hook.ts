import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useActionInterceptor } from '@/src/core/hooks';
import { signUpService } from '@/src/core/services';

import { signUpFormSchema, type TSignIUpFormSchema } from '../constants';

export const useSignUpForm = () => {
  const labels = useTranslations('labels');
  const button = useTranslations('button');
  const validations = useTranslations('validations');
  const placeholders = useTranslations('placeholders');
  const descriptions = useTranslations('descriptions');

  const translate = {
    labels,
    button,
    validations,
    placeholders,
    descriptions,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm<TSignIUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    mode: 'onTouched',
  });

  const { state, execute, isPending } = useActionInterceptor(signUpService);

  const onSubmit = (data: TSignIUpFormSchema) => {
    startTransition(() => execute(data));
  };

  return {
    register,
    translate,
    errors,
    touchedFields,
    serverError: state.message,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: isPending || isSubmitting,
    isDisableSubmit: isPending || isSubmitting || !isValid,
  };
};
