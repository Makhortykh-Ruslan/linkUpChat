import type { ResponseEmptyModel } from '@core/types';
import { getTime } from 'date-fns';

export const SUCCESS_DEFAULT_RESPONSE_MODEL: ResponseEmptyModel = {
  success: true,
  message: '',
  data: null,
  get timestamp() {
    return getTime(new Date());
  },
};

export const ERROR_DEFAULT_RESPONSE_MODEL: ResponseEmptyModel = {
  success: false,
  message: '',
  data: null,
  get timestamp() {
    return getTime(new Date());
  },
};
