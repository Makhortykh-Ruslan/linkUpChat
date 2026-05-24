'use server';

import {
  ERROR_DEFAULT_RESPONSE_MODEL,
  SUCCESS_DEFAULT_RESPONSE_MODEL,
} from '@core/constants';
import type { SendMessageModel } from '@core/models/message.model';
import type { ResponseEmptyModel } from '@core/types';
import { getAuthData, insertMessage } from '@infrastructure/supabase';

export async function sendMessageServer(
  _prevData: ResponseEmptyModel,
  model: SendMessageModel,
): Promise<ResponseEmptyModel> {
  try {
    const authUser = await getAuthData();

    if (!authUser) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Not authenticated',
        description: 'Please sign in to continue.',
      };
    }

    const { content, conversation_id } = model;

    if (!content || !conversation_id) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Invalid message',
        description: 'Message content or conversation ID is missing.',
      };
    }

    const insertModel = {
      content,
      sender_id: authUser.id,
      conversation_id,
    };

    const { error: insertError } = await insertMessage(insertModel);

    if (insertError) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'Failed to send message',
        description: insertError.message,
      };
    }

    return {
      ...SUCCESS_DEFAULT_RESPONSE_MODEL,
      message: '',
    };
  } catch (err) {
    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message: 'Failed to send message',
      description: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
