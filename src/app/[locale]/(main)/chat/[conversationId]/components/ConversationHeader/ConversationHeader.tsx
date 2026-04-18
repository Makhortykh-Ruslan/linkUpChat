'use client';

import { Avatar, Icon } from '@/src/core/components';
import { appRoutes } from '@/src/core/constants/router-paths';
import type { ConversationDetailsDTO } from '@/src/core/dto';
import { useRouter } from '@/src/i18n/routing';

import { ConversationHeaderStyles } from './ConversationHeader.styles';

type ConversationHeaderProps = {
  conversationDetails: ConversationDetailsDTO;
};

export const ConversationHeader = ({
  conversationDetails,
}: ConversationHeaderProps) => {
  const { avatarUrl, title } = conversationDetails;
  const router = useRouter();
  const styles = ConversationHeaderStyles;

  return (
    <>
      <div data-component="conversation-header" className={styles.component}>
        <button
          className={styles.component_back}
          onClick={() => router.push(appRoutes.main.chat)}
        >
          <Icon name="arrow-left" className={styles.component_back_icon} />
        </button>

        <Avatar src={avatarUrl} alt={avatarUrl || 'Avatar'} size="lg" />

        <div className={styles.component_info}>
          <h2 className={styles.component_title}>{title || 'Group Chat'}</h2>
          <p className={styles.component_subtitle}>Active now</p>
        </div>
      </div>
    </>
  );
};
