'use client';

import type { ConversationDTO } from '@core/dto/conversation.dto';
import { getConversationDTOById } from '@core/services/conversation.service';
import { subscribeToUserParticipants } from '@infrastructure/supabase/realtime-participants.repository';
import { useEffect, useState } from 'react';

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
