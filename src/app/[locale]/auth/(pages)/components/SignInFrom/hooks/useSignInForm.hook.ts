import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { startTransition, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { ERROR_DEFAULT_RESPONSE_MODEL } from '@/src/core/constants';
import { signInService } from '@/src/core/services';

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

  const [state, formAction, isPending] = useActionState(signInService, {
    ...ERROR_DEFAULT_RESPONSE_MODEL,
  });

  useEffect(() => {
    if (!state.message) return;

    if (!state.success) {
      alert(state.message);
    }
  }, [state]);

  const onSubmit = (data: TSignInFormSchema) => {
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
