'use server';

import { mapUserToDTO } from '@core/adapters/user.adapter';
import {
  ERROR_DEFAULT_RESPONSE_MODEL,
  SUCCESS_DEFAULT_RESPONSE_MODEL,
} from '@core/constants';
import type { UserDTO } from '@core/dto';
import type { ChangePasswordModel } from '@core/models';
import type { ResponseModel } from '@core/models/response.model';
import type { ResponseEmptyModel, ResponseUserDTOModel } from '@core/types';
import { parseDataUrl } from '@core/utils';
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
} from '@infrastructure/supabase';
import {
  getOtherParticipantsInMyConversations,
  getParticipantsByUserId,
} from '@infrastructure/supabase/participants.repository';

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
        message: 'Update error',
        description: error.message,
      };
    }

    return {
      ...SUCCESS_DEFAULT_RESPONSE_MODEL,
      message: 'Changes saved',
      description: 'Your profile has been updated successfully.',
    };
  } catch (error) {
    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message: 'Update error',
      description: error instanceof Error ? error.message : 'Unknown error',
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
        description: 'Please sign in to continue.',
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
        message: 'Failed to load user',
        description:
          errorUser?.message ?? errorSystem?.message ?? 'Unknown error',
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
    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message: 'Failed to load user',
      description: error instanceof Error ? error.message : 'Unknown error',
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
        description: 'Please sign in to continue.',
      };
    }

    const { error: signInError } = await signIn(
      authUser.email,
      model.oldPassword,
    );

    if (signInError) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Incorrect password',
        description: 'The current password you entered is not valid.',
      };
    }

    const { error: updateError } = await updateAuthUser(
      authUser.email,
      model.newPassword,
    );

    if (updateError) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Password update failed',
        description: updateError.message,
      };
    }

    return {
      ...SUCCESS_DEFAULT_RESPONSE_MODEL,
      message: 'Password updated',
      description: 'Your password has been changed successfully.',
      data: null,
    };
  } catch (error) {
    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message: 'Password update failed',
      description: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export async function uploadAvatarService(
  dataUrl: string,
): Promise<ResponseModel<{ avatarUrl: string }>> {
  try {
    const authUser = await getAuthData();
    if (!authUser?.id) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Not authenticated',
        description: 'Please sign in to continue.',
      };
    }

    const parsed = parseDataUrl(dataUrl);
    if (!parsed) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Invalid image',
        description: 'Could not process the selected image.',
      };
    }

    const file = new File([new Uint8Array(parsed.buffer)], 'avatar.png', {
      type: parsed.contentType,
    });
    const result = await uploadAvatarRepository(authUser.id, file);

    if ('error' in result) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Upload failed',
        description: result.error,
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
        message: 'Upload failed',
        description: error.message,
        data: null,
      };
    }

    return {
      ...SUCCESS_DEFAULT_RESPONSE_MODEL,
      data: { avatarUrl: avatarUrlWithCacheBust },
    };
  } catch (err) {
    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message: 'Upload failed',
      description: err instanceof Error ? err.message : 'Unknown error',
      data: null,
    };
  }
}

export async function deleteAvatarService(): Promise<ResponseEmptyModel> {
  try {
    const authUser = await getAuthData();
    if (!authUser?.id) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Not authenticated',
        description: 'Please sign in to continue.',
      };
    }

    const removeResult = await removeAvatarRepository(authUser.id);
    if (removeResult.error) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Failed to delete avatar',
        description: removeResult.error,
      };
    }

    const { error } = await updateUserRepository({
      id: authUser.id,
      avatar_url: '',
    });

    if (error) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Failed to delete avatar',
        description: error.message,
      };
    }

    return { ...SUCCESS_DEFAULT_RESPONSE_MODEL };
  } catch (err) {
    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message: 'Failed to delete avatar',
      description: err instanceof Error ? err.message : 'Unknown error',
    };
  }
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
        description: 'Please sign in to continue.',
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
        message: 'Search failed',
        description: error.message,
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
    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message: 'Search failed',
      description: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}
