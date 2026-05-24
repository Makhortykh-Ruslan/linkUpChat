import type { LayoutProps } from '@core/types';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SignUpForm } from '../components';
import { getPageStyles } from './page.styles';

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const metadata = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: metadata('signUpTitle'),
    description: metadata('signUpDescription'),
  };
}

export default async function SignUpPage({ params }: LayoutProps) {
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
        <h2 className={styles.page_title}>{titles('createAccount')}</h2>
        <p className={styles.page_description}>{descriptions('fillDetail')}</p>
      </header>
      <SignUpForm />
    </>
  );
}
