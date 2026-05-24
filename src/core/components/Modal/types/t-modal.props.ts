import type { ReactNode } from 'react';

import type { TModalVariant } from './t-modal-variant';

export type TModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: TModalVariant;
  contentClassName?: string;
};
