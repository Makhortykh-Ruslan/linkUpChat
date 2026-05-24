'use client';

import { useEffect, useRef, useState } from 'react';

import { Portal } from '../Portal/Portal';
import { getModalStyles } from './Modal.styles';
import type { TModalProps } from './types';

export const Modal = ({
  isOpen,
  onClose,
  children,
  variant = 'fixed',
  contentClassName,
}: TModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsVisible(isOpen));
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  const styles = getModalStyles(variant, contentClassName, isVisible);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (contentRef.current?.contains(e.target as Node)) return;
    onClose();
  };

  return (
    <Portal>
      <div
        data-component="ModalOverlay"
        className={styles.overlay}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
      >
        <div
          data-component="ModalContent"
          ref={contentRef}
          className={styles.content}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};
