'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Portal } from '../Portal/Portal';
import { getAlertStyles } from './Alert.styles';
import type { TAlertProps } from './type';

const DEFAULT_DURATION = 5000;

export const Alert = ({
  namespace,
  messageKey,
  variant,
  onDismiss,
  autoHide = false,
  duration = DEFAULT_DURATION,
}: TAlertProps) => {
  const t = useTranslations(namespace);
  const [isVisible, setIsVisible] = useState(false);
  const title = t(`${messageKey}.title`);
  const description = t(`${messageKey}.description`);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const styles = getAlertStyles(variant, isVisible);

  useEffect(() => {
    if (!autoHide || !onDismiss || duration <= 0) return;
    const id = window.setTimeout(onDismiss, duration);
    return () => clearTimeout(id);
  }, [autoHide, onDismiss, duration]);

  return (
    <Portal>
      <div
        data-component="Alert"
        className={styles.wrapper}
        role="alert"
        aria-live="polite"
      >
        <div className={styles.component}>
          <div className="flex flex-1 flex-col gap-0 min-w-0">
            <p className={styles.title}>{title}</p>
            {description != null && description !== '' && (
              <p className={styles.description}>{description}</p>
            )}
          </div>
          {onDismiss && (
            <button
              type="button"
              className={styles.close}
              onClick={onDismiss}
              aria-label="Закрити"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </Portal>
  );
};
