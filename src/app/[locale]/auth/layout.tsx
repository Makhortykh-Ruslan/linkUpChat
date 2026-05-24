import { Logo } from '@core/components/Logo/Logo';
import type { LayoutProps } from '@core/types';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import { AbilityCard } from './components/AbilityCard';
import { ABILITY_CARDS } from './constants/ability-cards';
import { getLayoutStyles } from './layout.styles';

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const metadata = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: metadata('authTitle'),
    description: metadata('authDescription'),
  };
}

export default async function AuthLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  const titles = await getTranslations({
    locale,
    namespace: 'titles',
  });

  const descriptions = await getTranslations({
    locale,
    namespace: 'descriptions',
  });

  const styles = getLayoutStyles();

  return (
    <main data-component="auth-layout" className={styles.page}>
      <section className={styles.page_introducing}>
        <div className={styles.page_introducing_container}>
          <Logo />

          <h1 id="intro-title" className={styles.page_title}>
            LinkUp Chat
          </h1>

          <p className={styles.page_description}>
            {descriptions('introducing')}
          </p>

          <div className={styles.page_cards}>
            {ABILITY_CARDS.map((el) => (
              <AbilityCard
                key={el.id}
                {...el}
                title={titles(el.title)}
                description={descriptions(el.description)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.page_children}>
        <div className={styles.page_children_item}>{children}</div>
      </section>
    </main>
  );
}
