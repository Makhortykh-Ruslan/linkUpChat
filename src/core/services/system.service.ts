import {
  ERROR_DEFAULT_RESPONSE_MODEL,
  SUCCESS_DEFAULT_RESPONSE_MODEL,
} from '@/src/core/constants';
import type { SystemSettingsModel } from '@/src/core/models';
import {
  getAuthData,
  updateSystemSettingsRepository,
} from '@/src/infrastructure/supabase';

export const updateSystemService = async (settings: SystemSettingsModel) => {
  try {
    const authUser = await getAuthData();

    if (!authUser) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Not authenticated',
      };
    }

    const { data: updateData, error } = await updateSystemSettingsRepository({
      ...settings,
      user_id: authUser.id,
    });

    if (error) {
      console.error('Supabase update error:', error);
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Error update profile settings details',
      };
    }

    return {
      ...SUCCESS_DEFAULT_RESPONSE_MODEL,
      data: updateData,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message,
    };
  }
};
