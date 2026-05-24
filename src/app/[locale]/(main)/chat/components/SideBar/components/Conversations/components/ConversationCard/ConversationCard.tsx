'use client';

import { Avatar } from '@core/components';
import type { ConversationDTO } from '@core/dto/conversation.dto';
import { formatMessageTime } from '@core/utils';
import { useLocale } from 'next-intl';
import React, { memo } from 'react';

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
  const locale = useLocale();
  const styles = conversationCardStyles;

  const time = lastMessage?.created_at
    ? formatMessageTime(lastMessage.created_at, locale as 'uk' | 'en')
    : '';

  return (
    <article
      data-component="ConversationCard"
      onClick={onClick}
      className={styles.component(isActive)}
    >
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
          <span className={styles.component_time} suppressHydrationWarning>
            {time}
          </span>
        </div>
      </div>
    </article>
  );
};

export const ConversationCard = memo(ConversationCardComponent);

ConversationCard.displayName = 'ConversationCard';
