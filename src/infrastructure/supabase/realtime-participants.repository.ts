'use client';

import { EBDTableName } from '@core/enums';
import type { Participant } from '@core/models';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { createBrowserSupabaseClient } from './client.supabase';

export function subscribeToUserParticipants(
  userId: string,
  onNewParticipant: (participant: Participant) => void,
): RealtimeChannel {
  const supabase = createBrowserSupabaseClient();

  const channel = supabase
    .channel(`participants:user_id=eq.${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: EBDTableName.CONVERSATION_PARTICIPANTS,
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNewParticipant(payload.new as Participant);
      },
    )
    .subscribe();

  return channel;
}
