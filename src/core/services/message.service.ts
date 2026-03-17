'use server';

import {
  ERROR_DEFAULT_RESPONSE_MODEL,
  SUCCESS_DEFAULT_RESPONSE_MODEL,
} from '@/src/core/constants';
import { EControlName } from '@/src/core/enums';
import type { ResponseEmptyModel } from '@/src/core/types';
import { getAuthData, insertMessage } from '@/src/infrastructure/supabase';

export async function sendMessageServer(
  _prevData: ResponseEmptyModel,
  formData: FormData,
): Promise<ResponseEmptyModel> {
  try {
    const authUser = await getAuthData();

    if (!authUser) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Not authenticated',
      };
    }

    const sender_id = authUser.id;
    const content = formData.get(EControlName.CONTENT) as string;
    const conversation_id = formData.get(
      EControlName.CONVERSATION_ID,
    ) as string;

    if (!content || !conversation_id) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Invalid form data.',
      };
    }

    const model = {
      content,
      sender_id,
      conversation_id,
    };

    const { error } = await insertMessage(model);

    if (error) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: error.message,
      };
    }

    return {
      ...SUCCESS_DEFAULT_RESPONSE_MODEL,
      message: '',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message,
    };
  }
}
