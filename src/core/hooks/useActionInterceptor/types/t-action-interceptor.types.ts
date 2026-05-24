import type { ResponseModel } from '@core/models/response.model';

export type TActionInterceptorOptions<R> = {
  onSuccess?: (data: R | null) => void;
  onError?: (message: string) => void;
};

export type TActionInterceptorAction<T, R> = (
  state: ResponseModel<R>,
  payload: T,
) => Promise<ResponseModel<R>> | ResponseModel<R>;

export type TActionInterceptorReturn<T, R> = {
  state: ResponseModel<R>;
  execute: (payload: T) => void;
  isPending: boolean;
};
