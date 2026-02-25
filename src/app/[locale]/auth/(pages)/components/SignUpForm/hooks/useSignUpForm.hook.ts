import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { startTransition, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { ERROR_DEFAULT_RESPONSE_MODEL } from '@/src/core/constants';
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
    formState: { errors, isSubmitting, isValid },
  } = useForm<TSignIUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    mode: 'onTouched',
  });

  const [state, formAction, isPending] = useActionState(signUpService, {
    ...ERROR_DEFAULT_RESPONSE_MODEL,
  });

  useEffect(() => {
    if (!state.message) return;

    if (!state.success) {
      alert(state.message);
    }
  }, [state]);

  const onSubmit = (data: TSignIUpFormSchema) => {
    startTransition(() => formAction(data));
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
