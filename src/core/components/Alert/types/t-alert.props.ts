import type { TAlertVariant } from './t-alert-variant';

export type TAlertProps = {
  title: string;
  description?: string;
  variant: TAlertVariant;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
};
