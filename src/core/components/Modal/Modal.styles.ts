import clsx from 'clsx';

import type { TModalVariant } from './type';

export const getModalStyles = (
  variant: TModalVariant,
  contentClassName?: string,
  isVisible?: boolean,
) => ({
  overlay: clsx(
    'fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm transition-opacity duration-200 ease-out',
    variant === 'fullscreen' && 'p-0',
    variant === 'fixed' && 'p-4',
    isVisible ? 'opacity-100' : 'opacity-0',
  ),
  content: clsx(
    'relative max-h-[90vh] overflow-auto border border-main-border bg-gray-0 dark:bg-brand-925 shadow-xl transition-all duration-200 ease-out',
    variant === 'fullscreen' &&
      'w-full h-full max-w-none max-h-none rounded-none',
    variant === 'fixed' && 'w-full max-w-lg rounded-[16px]',
    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
    contentClassName,
  ),
});
