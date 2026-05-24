import type { TIcon } from '@/src/core/types';

export type TIconProps = {
  name: TIcon;
  className?: string;
  onClick?: () => void;
};
