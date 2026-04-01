'use server';

import { mapUserToDTO } from '@/src/core/adapters/user.adapter';
import {
  ERROR_DEFAULT_RESPONSE_MODEL,
  SUCCESS_DEFAULT_RESPONSE_MODEL,
} from '@/src/core/constants';
import type { UserDTO } from '@/src/core/dto';
import type { ChangePasswordModel } from '@/src/core/models';
import type { ResponseModel } from '@/src/core/models/response.model';
import type {
  ResponseEmptyModel,
  ResponseUserDTOModel,
} from '@/src/core/types';
import {
  getAuthData,
  getSystemSettingByUserIdRepository,
  getUserByIdRepository,
  getUsersBySearchWithoutCurrentUserRepository,
  removeAvatarRepository,
  signIn,
  updateAuthUser,
  updateUserRepository,
  uploadAvatarRepository,
} from '@/src/infrastructure/supabase';
import {
  getOtherParticipantsInMyConversations,
  getParticipantsByUserId,
} from '@/src/infrastructure/supabase/participants.repository';

export const updateUserInfoService = async (
  _prevData: ResponseEmptyModel,
  data: UserDTO,
): Promise<ResponseEmptyModel> => {
  try {
    const { fullName, ...restData } = data;

    const model = {
      ...restData,
      user_name: fullName,
    };

    const authResponse = await updateAuthUser(model.email);
    const userResponse = await updateUserRepository(model);

    const error = authResponse.error || userResponse.error;

    if (error) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'userSavedError',
      };
    }

    return {
      ...SUCCESS_DEFAULT_RESPONSE_MODEL,
      message: 'userSaved',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message,
    };
  }
};

export const getUserInfoService = async (): Promise<ResponseUserDTOModel> => {
  try {
    const authUser = await getAuthData();

    if (!authUser) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Not authenticated',
      };
    }

    const authUserId = authUser.id;

    const [user, system] = await Promise.all([
      getUserByIdRepository(authUserId),
      getSystemSettingByUserIdRepository(authUserId),
    ]);

    const { data: dataUser, error: errorUser } = user;
    const { data: dataSystem, error: errorSystem } = system;

    if (errorUser || errorSystem) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Error user details',
      };
    }

    const { theme, language } = dataSystem;

    const model = {
      ...dataUser,
      theme,
      language,
    };

    const data = mapUserToDTO(model);

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
      return { ...ERROR_DEFAULT_RESPONSE_MODEL, message: 'userSavedError' };
    }

    const parsed = parseDataUrl(dataUrl);
    if (!parsed) {
      return { ...ERROR_DEFAULT_RESPONSE_MODEL, message: 'userSavedError' };
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

    const { error } = await updateUserRepository({
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
    const message = err instanceof Error ? err.message : 'userSavedError';
    return { ...ERROR_DEFAULT_RESPONSE_MODEL, message, data: null };
  }
}

export async function deleteAvatarService(): Promise<ResponseEmptyModel> {
  try {
    const authUser = await getAuthData();
    if (!authUser?.id) {
      return { ...ERROR_DEFAULT_RESPONSE_MODEL, message: 'userSavedError' };
    }

    const removeResult = await removeAvatarRepository(authUser.id);
    if (removeResult.error) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: removeResult.error,
      };
    }

    const { error } = await updateUserRepository({
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
    const message = err instanceof Error ? err.message : 'userSavedError';
    return { ...ERROR_DEFAULT_RESPONSE_MODEL, message };
  }
}

export async function setUserOnlineStatusAction(
  isOnline: boolean,
): Promise<void> {
  const authUser = await getAuthData();

  if (!authUser?.id) return;

  await updateUserRepository({ id: authUser.id, is_online: isOnline });
}

export async function getUsersWithFiltersService(
  search?: string,
): Promise<ResponseModel<UserDTO[]>> {
  try {
    const authUser = await getAuthData();

    if (!authUser?.id) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Not authenticated',
        data: null,
      };
    }

    const trimmedSearch = search?.trim() ?? '';
    if (!trimmedSearch) {
      return {
        ...SUCCESS_DEFAULT_RESPONSE_MODEL,
        data: [],
      };
    }

    const { data: users, error } =
      await getUsersBySearchWithoutCurrentUserRepository(
        trimmedSearch,
        authUser.id,
      );

    if (error) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: error.message,
        data: null,
      };
    }

    const myParticipants = await getParticipantsByUserId(authUser.id);
    const myConversationIds = myParticipants.map((p) => p.conversation_id);

    let existingUserIds = new Set<string>();

    if (myConversationIds.length > 0) {
      const otherParticipants = await getOtherParticipantsInMyConversations(
        authUser.id,
        myConversationIds,
      );
      existingUserIds = new Set(otherParticipants.map((p) => p.user_id));
    }

    const data = (users ?? [])
      .filter((u) => !existingUserIds.has(u.id))
      .map(mapUserToDTO);

    return {
      ...SUCCESS_DEFAULT_RESPONSE_MODEL,
      data,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message,
      data: null,
    };
  }
}
