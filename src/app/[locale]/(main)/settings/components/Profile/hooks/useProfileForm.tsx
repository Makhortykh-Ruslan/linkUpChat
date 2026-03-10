import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';

import type { ProfileDTO } from '@/src/core/dto';
import { useActionInterceptor } from '@/src/core/hooks';
import { updateProfileInfoService } from '@/src/core/services';

import { profileFormSchema, type TProfileFormSchema } from '../constants';

export const useProfileForm = ({ email, fullName, id }: ProfileDTO) => {
  const titles = useTranslations('titles');
  const labels = useTranslations('labels');
  const button = useTranslations('button');
  const validations = useTranslations('validations');
  const placeholders = useTranslations('placeholders');
  const descriptions = useTranslations('descriptions');

  const translate = {
    titles,
    labels,
    button,
    validations,
    placeholders,
    descriptions,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<TProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
    defaultValues: {
      email,
      fullName,
      id,
    },
  });

  const { state, execute, isPending } = useActionInterceptor(
    updateProfileInfoService,
  );

  const onSubmit = (data: TProfileFormSchema) => {
    startTransition(() => execute(data as ProfileDTO));
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
