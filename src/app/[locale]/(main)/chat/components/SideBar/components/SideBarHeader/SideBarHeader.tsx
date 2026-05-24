'use client';

import { Icon } from '@core/components';
import { appRoutes } from '@core/constants';
import type { UserDTO } from '@core/dto';
import { findOrCreateConversation } from '@core/services/conversation.service';
import { useRouter } from '@i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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

  return (
    <>
      <section data-component="SideBarHeader" className={styles.component}>
        <h3 className={styles.title}>{titles('messages')}</h3>

        <button className={styles.icon_btn} onClick={handleOpenUsersModal}>
          <Icon name="plus" className={styles.icon} />
        </button>

        <button
          className={styles.icon_btn_settings}
          onClick={handleRedirectToSettings}
        >
          <Icon name="settings" className={styles.icon} />
        </button>
      </section>

      <UsersModal isOpen={isUsersModalOpen} onClose={handleUsersModalClose} />
    </>
  );
};
