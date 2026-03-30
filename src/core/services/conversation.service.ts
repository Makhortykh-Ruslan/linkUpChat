'use server';

import type { ConversationDTO } from '@/src/core/dto/conversation.dto';
import type { UserModel } from '@/src/core/models';
import type { MessageModel } from '@/src/core/models/message.model';
import {
  createConversation,
  getAuthData,
  getConversationById,
  getConversationsByIds,
  getLastConversationMessage,
  getUsersByIdsRepository,
} from '@/src/infrastructure/supabase';
import {
  findExistingDirectConversationId,
  getOtherParticipantsInMyConversations,
  getParticipantsByConversationId,
  getParticipantsByUserId,
  insertParticipants,
} from '@/src/infrastructure/supabase/participants.repository';

export async function findOrCreateConversation(
  targetUserId: string,
): Promise<string> {
  const authUser = await getAuthData();
  if (!authUser) {
    throw new Error('Not authenticated');
  }

  const authUserId = authUser.id;

  const myParticipants = await getParticipantsByUserId(authUserId);
  const myConversationIds = myParticipants.map((p) => p.conversation_id);

  if (myConversationIds.length > 0) {
    const existingConversationId = await findExistingDirectConversationId(
      targetUserId,
      myConversationIds,
    );

    if (existingConversationId) {
      return existingConversationId;
    }
  }

  const newConversationId = await createConversation('direct');

  await insertParticipants([
    { conversation_id: newConversationId, user_id: authUserId },
    { conversation_id: newConversationId, user_id: targetUserId },
  ]);

  return newConversationId;
}

export async function getSidebarConversations(): Promise<ConversationDTO[]> {
  const authUser = await getAuthData();
  if (!authUser) throw new Error('Not authenticated');

  const authUserId = authUser.id;

  const participants = await getParticipantsByUserId(authUserId);
  const conversationIds = participants.map((p) => p.conversation_id);

  if (!conversationIds.length) return [];

  const participantsInMyConversations =
    await getOtherParticipantsInMyConversations(authUserId, conversationIds);

  const userIds = participantsInMyConversations.map((p) => p.user_id);

  const [users, messages, conversations] = await Promise.all([
    getUsersByIdsRepository(userIds),
    getLastConversationMessage(conversationIds),
    getConversationsByIds(conversationIds),
  ]);

  const userByConversationId = new Map<string, UserModel>();

  participantsInMyConversations.forEach((p) => {
    const user = users.find((u) => u.id === p.user_id);
    if (user) userByConversationId.set(p.conversation_id, user);
  });

  const lastMessageByConversationId = new Map<string, MessageModel>();

  messages.forEach((m) => {
    lastMessageByConversationId.set(m.conversation_id, m);
  });

  return conversations.map((conversation) => {
    const user = userByConversationId.get(conversation.id);
    const lastMessage = lastMessageByConversationId.get(conversation.id);

    return {
      conversationId: conversation.id,
      type: conversation.type,
      title: user?.user_name ?? '',
      avatarUrl: user?.avatar_url ?? null,
      lastMessage: lastMessage ?? null,
    };
  });
}

export async function getConversationDTOById(
  conversationId: string,
): Promise<ConversationDTO | null> {
  const authUser = await getAuthData();
  if (!authUser) throw new Error('Not authenticated');

  const authUserId = authUser.id;

  const [conversation, allParticipants] = await Promise.all([
    getConversationById(conversationId),
    getParticipantsByConversationId(conversationId),
  ]);

  if (!conversation) return null;

  const otherParticipants = allParticipants.filter(
    (p) => p.user_id !== authUserId,
  );
  const otherUserIds = otherParticipants.map((p) => p.user_id);

  const [users, messages] = await Promise.all([
    getUsersByIdsRepository(otherUserIds),
    getLastConversationMessage([conversationId]),
  ]);

  const otherUser = users[0] ?? null;
  const lastMessage = messages[0] ?? null;

  return {
    conversationId: conversation.id,
    type: conversation.type,
    title: otherUser?.user_name ?? null,
    avatarUrl: otherUser?.avatar_url ?? null,
    lastMessage,
  };
}

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

export async function getConversationDetails(
  conversationId: string,
): Promise<ConversationDetailsDTO | null> {
  const authUser = await getAuthData();

  if (!authUser) throw new Error('Not authenticated');

  const authUserId = authUser.id;

  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    return null;
  }

  const participants = await getParticipantsByConversationId(conversationId);

  const isParticipant = participants.some((p) => p.user_id === authUserId);
  if (!isParticipant) {
    throw new Error(
      'Access denied: You are not a participant of this conversation',
    );
  }

  const userIds = participants.map((p) => p.user_id);

  const users = await getUsersByIdsRepository(userIds);

  const userByUserId = new Map<string, UserModel>();
  users.forEach((user) => {
    userByUserId.set(user.id, user);
  });

  const participantsWithUsers = participants
    .map((participant) => {
      const user = userByUserId.get(participant.user_id);
      if (!user) return null;
      return {
        userId: participant.user_id,
        user,
      };
    })
    .filter((p): p is { userId: string; user: UserModel } => p !== null);

  let title: string | null = null;
  let avatarUrl: string | null = null;

  if (conversation.type === 'direct') {
    const otherParticipant = participantsWithUsers.find(
      (p) => p.userId !== authUserId,
    );
    if (otherParticipant) {
      title = otherParticipant.user.user_name;
      avatarUrl = otherParticipant.user.avatar_url;
    }
  } else {
    title = null;
    avatarUrl = null;
  }

  return {
    conversationId: conversation.id,
    type: conversation.type as 'direct' | 'group',
    title,
    avatarUrl,
    participants: participantsWithUsers,
  };
}
