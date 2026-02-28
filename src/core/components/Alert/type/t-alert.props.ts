import type { TAlertNamespace } from './t-alert-namespace';
import type { TAlertVariant } from './t-alert-variant';

export type TAlertProps = {
  namespace: TAlertNamespace;
  messageKey: string;
  variant: TAlertVariant;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
};
