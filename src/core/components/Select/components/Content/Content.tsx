'use client';

import {
  type ReactNode,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';

import { useSelectContext } from '../../context';
import { ContentStyles } from './Content.styles';

const subscribe = () => () => {};

export const Content = ({ children }: { children: ReactNode }) => {
  const { isOpen, coords, toggle } = useSelectContext();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        toggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggle]);

  if (!isOpen || !mounted || !coords) return null;

  const styles = ContentStyles;

  return createPortal(
    <div
      data-component="SelectContent"
      ref={contentRef}
      className={styles.component}
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: `${coords.width}px`,
      }}
    >
      {children}
    </div>,
    document.body,
  );
};
