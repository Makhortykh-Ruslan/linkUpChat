import type { TTab } from '@/src/core/components/Tabs/types';

export const SIDEBAR_TABS_CONFIG = [
  {
    name: 'all',
    id: 'all',
  },
  {
    name: 'direct',
    id: 'direct',
  },
  {
    name: 'groups',
    id: 'groups',
  },
] as const satisfies readonly TTab[];

export type TTabConfigKey = (typeof SIDEBAR_TABS_CONFIG)[number]['id'];
