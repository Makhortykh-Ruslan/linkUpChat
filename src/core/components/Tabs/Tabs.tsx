'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { tabsStyles } from '@/src/core/components/Tabs/Tabs.styles';

import type { TTabsProps } from './types';

export const Tabs = <T extends string>({
  tabs,
  onChangeTab,
  activeTabId,
}: TTabsProps<T>) => {
  const translate = useTranslations('labels');
  const styles = tabsStyles();

  return (
    <div data-component="tabs" className={styles.component}>
      {tabs.map((el) => (
        <button
          key={el.id}
          type="button"
          className={clsx(styles.component_item, {
            [styles.component_item_active]: activeTabId === el.id,
          })}
          onClick={() => onChangeTab(el)}
        >
          {translate(el.name)}
        </button>
      ))}
    </div>
  );
};
