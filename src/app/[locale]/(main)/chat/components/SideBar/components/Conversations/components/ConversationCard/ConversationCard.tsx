'use client';

import React, { memo } from 'react';

import { Avatar } from '@/src/core/components';
import type { ConversationDTO } from '@/src/core/dto/conversation.dto';

import { conversationCardStyles } from './ConversationCard.styles';

type Props = Partial<ConversationDTO> & {
  onClick?: () => void;
  isActive?: boolean;
};

const ConversationCardComponent = ({
  avatarUrl,
  title,
  lastMessage,
  onClick,
  isActive = false,
}: Props) => {
  const styles = conversationCardStyles;

  return (
    <article onClick={onClick} className={styles.component(isActive)}>
      <div className={styles.component_avatar}>
        <Avatar src={avatarUrl || ''} alt={title || 'Avatar'} size="lg" />
      </div>
      <div className={styles.component_body}>
        <div className={styles.component_info}>
          <p className={styles.component_title}>{title}</p>
          <p className={styles.component_message}>
            {lastMessage?.content || ''}
          </p>
        </div>
        <div className={styles.component_meta}>
          <span className={styles.component_time}>
            {lastMessage?.created_at || ''}
          </span>
          <div className={styles.component_count} />
        </div>
      </div>
    </article>
  );
};

export const ConversationCard = memo(ConversationCardComponent);

ConversationCard.displayName = 'ConversationCard';
