import type { UserModel } from '@core/models';
import type { MessageModel } from '@core/models/message.model';
import type { TConversationType } from '@core/types';

export type ConversationDTO = {
  type: TConversationType;
  title: string | null;
  avatarUrl: string | null;
  conversationId: string;
  lastMessage: MessageModel | null;
};

export type ConversationDetailsDTO = {
  conversationId: string;
  type: 'direct' | 'group';
  title: string | null;
  avatarUrl: string | null;
  participants: Array<{
    userId: string;
    user: UserModel;
  }>;
};
