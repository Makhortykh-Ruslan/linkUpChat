'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Icon } from '@/src/core/components';
import { appRoutes } from '@/src/core/constants';
import type { UserDTO } from '@/src/core/dto';
import { findOrCreateConversation } from '@/src/core/services/conversation.service';
import { useRouter } from '@/src/i18n/routing';

import { UsersModal } from '../../../UsersModal';
import { getSideBarStyles } from './SideBarHeader.styles';

export const SideBarHeader = () => {
  const router = useRouter();
  const titles = useTranslations('titles');

  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);

  const handleRedirectToSettings = () => {
    router.push(appRoutes.main.settings);
  };

  const handleOpenUsersModal = () => {
    setIsUsersModalOpen(true);
  };

  const handleUsersModalClose = async (user?: UserDTO) => {
    setIsUsersModalOpen(false);

    if (!user) return;

    const conversationId = await findOrCreateConversation(user.id);
    router.push(`${appRoutes.main.chat}/${conversationId}`);
  };

  const styles = getSideBarStyles();
  const iconSearch = styles.icon + ' ' + 'ml-auto';

  return (
    <>
      <section data-component="SideBarHeader" className={styles.component}>
        <h3 className={styles.title}>{titles('messages')}</h3>
        <Icon
          name="plus"
          className={iconSearch}
          onClick={handleOpenUsersModal}
        />

        <Icon
          name="settings"
          className={styles.icon}
          onClick={handleRedirectToSettings}
        />
      </section>

      <UsersModal
        isOpen={isUsersModalOpen}
        onClose={handleUsersModalClose}
      />
    </>
  );
};
