import type { LayoutProps } from '@core/types';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { EmptyBlock } from './components';
import { pageStyles } from './styles';

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

export default async function ChatPage({ params }: LayoutProps) {
  const { locale } = await params;

  return (
    <div className={pageStyles.page}>
      {
        <EmptyBlock
          locale={locale}
          titleKey="selectAChat"
          descriptionKey="chooseConversation"
        />
      }
    </div>
  );
}
