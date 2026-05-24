'use server';

import {
  ERROR_DEFAULT_RESPONSE_MODEL,
  SUCCESS_DEFAULT_RESPONSE_MODEL,
} from '@core/constants';
import type { SystemSettingsModel } from '@core/models';
import {
  getAuthData,
  updateSystemSettingsRepository,
} from '@infrastructure/supabase';

export const updateSystemService = async (settings: SystemSettingsModel) => {
  try {
    const authUser = await getAuthData();

    if (!authUser) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Not authenticated',
        description: 'Please sign in to continue.',
      };
    }

    const { data: updateData, error } = await updateSystemSettingsRepository({
      ...settings,
      user_id: authUser.id,
    });

    if (error) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Failed to update settings',
        description: error.message,
      };
    }

    return {
      ...SUCCESS_DEFAULT_RESPONSE_MODEL,
      data: updateData,
    };
  } catch (error) {
    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message: 'Failed to update settings',
      description: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
