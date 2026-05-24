import type { TIcon } from '@core/types';

export type TIconProps = {
  name: TIcon;
  className?: string;
  onClick?: () => void;
};
