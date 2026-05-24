'use server';

import { EBDTableName } from '@core/enums';
import type { Participant } from '@core/models';
import { createClient } from '@infrastructure/supabase/server.supabase';

export async function insertParticipants(data: Participant[]) {
  const supabase = await createClient();
  await supabase.from(EBDTableName.CONVERSATION_PARTICIPANTS).insert(data);
}

export async function getParticipantsByUserId(
  userId: string,
): Promise<Participant[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(EBDTableName.CONVERSATION_PARTICIPANTS)
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getOtherParticipantsInMyConversations(
  authUserId: string,
  conversationsIds: string[],
): Promise<Participant[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(EBDTableName.CONVERSATION_PARTICIPANTS)
    .select('*')
    .in('conversation_id', conversationsIds)
    .neq('user_id', authUserId);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function findExistingDirectConversationId(
  userId: string,
  conversationIds: string[],
): Promise<string | undefined> {
  const supabase = await createClient();

  const { data: existing, error } = await supabase
    .from(EBDTableName.CONVERSATION_PARTICIPANTS)
    .select('conversation_id')
    .eq('user_id', userId)
    .in('conversation_id', conversationIds)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (existing?.conversation_id) {
    return existing.conversation_id;
  }
}

export async function getParticipantsByConversationId(
  conversationId: string,
): Promise<Participant[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(EBDTableName.CONVERSATION_PARTICIPANTS)
    .select('*')
    .eq('conversation_id', conversationId);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
