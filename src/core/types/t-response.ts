import type { PostgrestSingleResponse } from '@supabase/postgrest-js';

import type { UserDTO } from '@/src/core/dto';
import type { SystemSettingsModel, UserModel } from '@/src/core/models';
import type { ResponseModel } from '@/src/core/models/response.model';

export type PostgrestSystemResponse =
  PostgrestSingleResponse<SystemSettingsModel>;

export type PostgrestUserResponse = PostgrestSingleResponse<UserModel>;

export type ResponseEmptyModel = ResponseModel<null>;

export type ResponseUserDTOModel = ResponseModel<UserDTO>;
