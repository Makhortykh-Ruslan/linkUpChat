'use client';

import { Icon } from '@core/components';
import { appRoutes } from '@core/constants';
import { useRouter } from '@i18n/routing';
import { useTranslations } from 'next-intl';

import { SettingsHeaderStyles } from './SettingsHeader.styles';

export const SettingsHeader = () => {
  const titles = useTranslations('titles');
  const styles = SettingsHeaderStyles;
  const router = useRouter();

  const handleBackTo = () => {
    router.push(appRoutes.main.chat);
  };

  return (
    <div
      data-component="SettingsHeader"
      className={styles.component}
      onClick={handleBackTo}
    >
      <Icon name="arrow-left" className={styles.component_icon} />
      <p className={styles.component_title}>{titles('backToChat')}</p>
    </div>
  );
};
