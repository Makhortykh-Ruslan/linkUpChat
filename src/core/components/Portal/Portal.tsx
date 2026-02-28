'use client';

import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import type { TPortalProps } from './type';

export const Portal = ({ container, children }: TPortalProps) => {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  const target = container ?? document.body;

  return createPortal(children, target);
};
