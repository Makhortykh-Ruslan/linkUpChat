'use client';

import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import type { TPortalProps } from './types';

const subscribe = () => () => {};

export const Portal = ({ container, children }: TPortalProps) => {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  const target = container ?? document.body;

  return createPortal(children, target);
};
