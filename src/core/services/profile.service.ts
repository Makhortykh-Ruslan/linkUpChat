'use server';

import { mapProfileToDTO } from '@/src/core/adapters/profile.adapter';
import {
  ERROR_DEFAULT_RESPONSE_MODEL,
  SUCCESS_DEFAULT_RESPONSE_MODEL,
} from '@/src/core/constants';
import type { ProfileDTO } from '@/src/core/dto';
import type { ChangePasswordModel } from '@/src/core/models';
import type { ResponseModel } from '@/src/core/models/response.model';
import type {
  ResponseEmptyModel,
  ResponseProfileDTOModel,
} from '@/src/core/types';
import {
  getAuthData,
  getProfileByUserIdRepository,
  getSystemSettingByUserIdRepository,
  removeAvatarRepository,
  signIn,
  updateAuthUser,
  updateProfileRepository,
  uploadAvatarRepository,
} from '@/src/infrastructure/supabase';

export const updateProfileInfoService = async (
  _prevData: ResponseEmptyModel,
  data: ProfileDTO,
): Promise<ResponseEmptyModel> => {
  try {
    const { fullName, ...restData } = data;

    const model = {
      ...restData,
      user_name: fullName,
    };

    const authResponse = await updateAuthUser(model.email);
    const profileResponse = await updateProfileRepository(model);

    const error = authResponse.error || profileResponse.error;

    if (error) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'profileSavedError',
      };
    }

    return {
      ...SUCCESS_DEFAULT_RESPONSE_MODEL,
      message: 'profileSaved',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message,
    };
  }
};

export const getProfileInfoService =
  async (): Promise<ResponseProfileDTOModel> => {
    try {
      const authUser = await getAuthData();

      if (!authUser) {
        return {
          ...ERROR_DEFAULT_RESPONSE_MODEL,
          message: 'Not authenticated',
        };
      }

      const authUserId = authUser.id;

      const [profile, system] = await Promise.all([
        getProfileByUserIdRepository(authUserId),
        getSystemSettingByUserIdRepository(authUserId),
      ]);

      const { data: dataProfile, error: errorProfile } = profile;
      const { data: dataSystem, error: errorSystem } = system;

      if (errorProfile || errorSystem) {
        return {
          ...ERROR_DEFAULT_RESPONSE_MODEL,
          message: 'Error profile details',
        };
      }

      const { theme, language } = dataSystem;

      const model = {
        ...dataProfile,
        theme,
        language,
      };

      const data = mapProfileToDTO(model);

      return {
        ...SUCCESS_DEFAULT_RESPONSE_MODEL,
        data,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message,
      };
    }
  };

export const updatePasswordService = async (
  _prevData: ResponseEmptyModel,
  model: ChangePasswordModel,
): Promise<ResponseEmptyModel> => {
  try {
    const authUser = await getAuthData();

    if (!authUser?.email) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Not authenticated',
      };
    }

    const { error: signInError } = await signIn(
      authUser.email,
      model.oldPassword,
    );

    if (signInError) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Old password in not valid',
      };
    }

    const { error: updateError } = await updateAuthUser(
      authUser.email,
      model.newPassword,
    );

    if (updateError) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: updateError.message,
      };
    }

    return {
      ...SUCCESS_DEFAULT_RESPONSE_MODEL,
      data: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message,
    };
  }
};

function parseDataUrl(
  dataUrl: string,
): { buffer: Buffer; contentType: string } | null {
  const match = /^data:(image\/[a-z]+);base64,(.+)$/i.exec(dataUrl);
  if (!match || match[1] == null || match[2] == null) return null;
  const contentType = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');
  return { buffer, contentType };
}

export async function uploadAvatarService(
  dataUrl: string,
): Promise<ResponseModel<{ avatarUrl: string }>> {
  try {
    const authUser = await getAuthData();
    if (!authUser?.id) {
      return { ...ERROR_DEFAULT_RESPONSE_MODEL, message: 'profileSavedError' };
    }

    const parsed = parseDataUrl(dataUrl);
    if (!parsed) {
      return { ...ERROR_DEFAULT_RESPONSE_MODEL, message: 'profileSavedError' };
    }

    const file = new File([new Uint8Array(parsed.buffer)], 'avatar.png', {
      type: parsed.contentType,
    });
    const result = await uploadAvatarRepository(authUser.id, file);

    if ('error' in result) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: result.error,
        data: null,
      };
    }

    const avatarUrlWithCacheBust = `${result.publicUrl}?t=${Date.now()}`;

    const { error } = await updateProfileRepository({
      id: authUser.id,
      avatar_url: avatarUrlWithCacheBust,
    });

    if (error) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: error.message,
        data: null,
      };
    }

    return {
      ...SUCCESS_DEFAULT_RESPONSE_MODEL,
      data: { avatarUrl: avatarUrlWithCacheBust },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'profileSavedError';
    return { ...ERROR_DEFAULT_RESPONSE_MODEL, message, data: null };
  }
}

export async function deleteAvatarService(): Promise<ResponseEmptyModel> {
  try {
    const authUser = await getAuthData();
    if (!authUser?.id) {
      return { ...ERROR_DEFAULT_RESPONSE_MODEL, message: 'profileSavedError' };
    }

    const removeResult = await removeAvatarRepository(authUser.id);
    if (removeResult.error) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: removeResult.error,
      };
    }

    const { error } = await updateProfileRepository({
      id: authUser.id,
      avatar_url: '',
    });

    if (error) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: error.message,
      };
    }

    return { ...SUCCESS_DEFAULT_RESPONSE_MODEL };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'profileSavedError';
    return { ...ERROR_DEFAULT_RESPONSE_MODEL, message };
  }
}
