import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';

import type { UserDTO } from '@/src/core/dto';
import { useActionInterceptor } from '@/src/core/hooks';
import { updateUserInfoService } from '@/src/core/services';

import { type TUserFormSchema, userFormSchema } from '../constants';

export const useUserForm = ({ email, fullName, id }: UserDTO) => {
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
  } = useForm<TUserFormSchema>({
    resolver: zodResolver(userFormSchema),
    mode: 'onChange',
    defaultValues: {
      email,
      fullName,
      id,
    },
  });

  const { state, execute, isPending } = useActionInterceptor(
    updateUserInfoService,
  );

  const onSubmit = (data: TUserFormSchema) => {
    startTransition(() => execute(data as UserDTO));
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
