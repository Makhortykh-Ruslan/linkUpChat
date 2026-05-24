import { SideBar } from '@app/[locale]/(main)/chat/components/SideBar/SideBar';
import type { LayoutProps } from '@core/types';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import { ChatLayoutClient } from './components/ChatLayoutClient';

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const metadata = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: metadata('chatTitle'),
    description: metadata('chatDescription'),
  };
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayoutClient sidebar={<SideBar />}>{children}</ChatLayoutClient>;
}
