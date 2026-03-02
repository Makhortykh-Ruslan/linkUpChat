'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

import { Alert } from '@/src/core/components/Alert/Alert';
import type { TAlertProps } from '@/src/core/components/Alert/type';

type TAlertOptions = Omit<TAlertProps, 'onDismiss'>;

type TAlertContext = {
  showAlert: (options: TAlertOptions) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<TAlertContext | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alertConfig, setAlertConfig] = useState<TAlertOptions | null>(null);

  const showAlert = useCallback((options: TAlertOptions) => {
    setAlertConfig(options);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig(null);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertConfig && <Alert {...alertConfig} onDismiss={hideAlert} />}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
