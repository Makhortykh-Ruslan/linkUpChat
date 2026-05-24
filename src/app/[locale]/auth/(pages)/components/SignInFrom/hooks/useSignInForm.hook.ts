import { useActionInterceptor } from '@core/hooks';
import { signInService } from '@core/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';

import { signInFormSchema, type TSignInFormSchema } from '../constants';

export const useSignInForm = () => {
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
    formState: { errors, isSubmitting, isValid },
  } = useForm<TSignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    mode: 'onTouched',
  });

  const { state, execute, isPending } = useActionInterceptor(signInService);

  const onSubmit = (data: TSignInFormSchema) => {
    startTransition(() => execute(data));
  };

  return {
    register,
    translate,
    errors,
    serverError: state.message,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: isPending || isSubmitting,
    isDisableSubmit: isPending || isSubmitting || !isValid,
  };
};
