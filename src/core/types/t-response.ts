import type { UserDTO } from '@core/dto';
import type { SystemSettingsModel, UserModel } from '@core/models';
import type { ResponseModel } from '@core/models/response.model';
import type { PostgrestSingleResponse } from '@supabase/postgrest-js';

export type PostgrestSystemResponse =
  PostgrestSingleResponse<SystemSettingsModel>;

export type PostgrestUserResponse = PostgrestSingleResponse<UserModel>;

export type ResponseEmptyModel = ResponseModel<null>;

export type ResponseUserDTOModel = ResponseModel<UserDTO>;
