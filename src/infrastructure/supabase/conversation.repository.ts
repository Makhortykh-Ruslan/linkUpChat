'use server';

import { EBDTableName } from '@core/enums';
import type { ConversationModel } from '@core/models/conversation.model';
import type { TConversationType } from '@core/types';

import { createClient } from './server.supabase';

export async function createConversation(
  type: TConversationType = 'direct',
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(EBDTableName.CONVERSATIONS)
    .insert({ type })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error('Failed to create conversation');
  }

  return data.id;
}

export async function getConversationsByIds(
  conversationIds: string[],
): Promise<ConversationModel[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(EBDTableName.CONVERSATIONS)
    .select('*')
    .in('id', conversationIds);

  if (error || !data) {
    throw new Error('Failed to create conversation');
  }

  return data || [];
}

export async function getConversationById(
  conversationId: string,
): Promise<ConversationModel | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(EBDTableName.CONVERSATIONS)
    .select('*')
    .eq('id', conversationId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
