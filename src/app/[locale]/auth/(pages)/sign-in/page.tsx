import type { LayoutProps } from '@core/types';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SignInFrom } from '../components';
import { getPageStyles } from './page.styles';

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const metadata = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: metadata('signInTitle'),
    description: metadata('signInDescription'),
  };
}

export default async function SignInPage({ params }: LayoutProps) {
  const { locale } = await params;

  const titles = await getTranslations({ locale, namespace: 'titles' });
  const descriptions = await getTranslations({
    locale,
    namespace: 'descriptions',
  });

  const styles = getPageStyles();

  return (
    <>
      <header className={styles.page}>
        <h2 className={styles.page_title}>{titles('welcomeBack')}</h2>
        <p className={styles.page_description}>
          {descriptions('enterCredentials')}
        </p>
      </header>
      <SignInFrom />
    </>
  );
}
