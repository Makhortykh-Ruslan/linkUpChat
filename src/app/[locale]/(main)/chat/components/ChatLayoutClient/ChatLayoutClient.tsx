'use client';

import { appRoutes } from '@core/constants/router-paths';
import { usePathname } from '@i18n/routing';
import React from 'react';

import { getChatLayoutStyles } from '../../styles';

type Props = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

const isConversationOpen = (pathname: string) =>
  pathname.startsWith(`${appRoutes.main.chat}/`);

export function ChatLayoutClient({ sidebar, children }: Props) {
  const pathname = usePathname();
  const conversationOpen = isConversationOpen(pathname);
  const styles = getChatLayoutStyles(conversationOpen);

  return (
    <main data-component="chat-layout" className={styles.page}>
      <section className={styles.sidebar}>{sidebar}</section>
      <section className={styles.children}>{children}</section>
    </main>
  );
}
