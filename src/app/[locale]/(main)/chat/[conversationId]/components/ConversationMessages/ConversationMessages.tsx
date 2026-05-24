'use client';

import { Message } from '@core/components';
import type { MessageDTO } from '@core/dto';
import type { MessageModel } from '@core/models/message.model';
import { subscribeToConversationMessages } from '@infrastructure/supabase/realtime-messages.repository';
import { useEffect, useRef, useState } from 'react';

type Props = {
  initialMessages: MessageDTO[];
  conversationId: string;
  authUserId: string;
};

function mapMessageModelToDTO(model: MessageModel): MessageDTO {
  return {
    id: String(model.id),
    createdAt: model.created_at,
    conversationId: model.conversation_id,
    senderId: model.sender_id,
    content: model.content,
  };
}

export const ConversationMessages = ({
  initialMessages,
  conversationId,
  authUserId,
}: Props) => {
  const [messages, setMessages] = useState<MessageDTO[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const channel = subscribeToConversationMessages(conversationId, (model) => {
      setMessages((prev) => [...prev, mapMessageModelToDTO(model)]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId]);

  return (
    <>
      <div data-component="ConversationMessages" className="mt-auto" />
      {messages.map((el) => {
        const isMine = el.senderId === authUserId;

        return (
          <div key={el.id} className={isMine ? 'flex justify-end' : ''}>
            <Message {...el} isMine={isMine} />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </>
  );
};
