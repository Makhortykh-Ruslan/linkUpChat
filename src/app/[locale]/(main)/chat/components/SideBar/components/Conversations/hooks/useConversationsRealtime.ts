'use client';

import { useEffect, useState } from 'react';

import type { ConversationDTO } from '@/src/core/dto/conversation.dto';
import { getConversationDTOById } from '@/src/core/services/conversation.service';
import { subscribeToUserParticipants } from '@/src/infrastructure/supabase/realtime-participants.repository';

export function useConversationsRealtime(
  initialConversations: ConversationDTO[],
  userId: string,
) {
  const [conversations, setConversations] =
    useState<ConversationDTO[]>(initialConversations);

  useEffect(() => {
    const channel = subscribeToUserParticipants(userId, async (participant) => {
      const conversationId = participant.conversation_id;

      const alreadyExists = conversations.some(
        (c) => c.conversationId === conversationId,
      );
      if (alreadyExists) return;

      const dto = await getConversationDTOById(conversationId);
      if (!dto) return;

      setConversations((prev) => [dto, ...prev]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  return conversations;
}
