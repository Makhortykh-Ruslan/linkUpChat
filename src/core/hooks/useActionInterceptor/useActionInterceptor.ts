'use client';

import { useActionState, useEffect } from 'react';

import { ERROR_DEFAULT_RESPONSE_MODEL } from '@/src/core/constants';
import { useAlert } from '@/src/core/context';
import type { ResponseModel } from '@/src/core/models/response.model';

import type {
  TActionInterceptorAction,
  TActionInterceptorOptions,
  TActionInterceptorReturn,
} from './types';

export function useActionInterceptor<T, R>(
  action: TActionInterceptorAction<T, R>,
  options: TActionInterceptorOptions<R> = {},
): TActionInterceptorReturn<T, R> {
  const { showAlert } = useAlert();
  const { onSuccess, onError } = options;

  const [state, formAction, isPending] = useActionState(action, {
    ...ERROR_DEFAULT_RESPONSE_MODEL,
    data: null,
  } as ResponseModel<R>);

  useEffect(() => {
    if (!state.message) return;

    showAlert({
      title: state.message || '',
      description: state.description || '',
      variant: state.success ? 'success' : 'error',
      autoHide: true,
    });

    if (state.success) {
      onSuccess?.(state.data);
    } else {
      onError?.(state.message);
    }
  }, [state.timestamp]);

  return {
    state,
    execute: formAction,
    isPending,
  };
}
