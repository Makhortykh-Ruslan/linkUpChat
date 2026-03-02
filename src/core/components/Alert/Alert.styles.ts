import clsx from 'clsx';

import type { TAlertVariant } from './type';

const variantBorder = {
  error: 'border-l-red-600 dark:border-l-red-500',
  success: 'border-l-green-600 dark:border-l-green-500',
  warning: 'border-l-amber-500 dark:border-l-amber-400',
} as const;

const variantMessage = {
  error: 'text-red-700 dark:text-red-400',
  success: 'text-green-700 dark:text-green-400',
  warning: 'text-amber-800 dark:text-amber-300',
} as const;

export const getAlertStyles = (
  variant: TAlertVariant,
  isVisible?: boolean,
) => ({
  wrapper: clsx(
    'fixed z-50 flex w-fit max-w-[min(400px,calc(100vw-32px))]',
    'bottom-4 right-4',
    'transition-all duration-200 ease-out',
    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
  ),
  component: clsx(
    'flex items-start gap-3 rounded-[12px] border border-main-border border-l-4 py-3 px-4 shadow-lg',
    'bg-gray-0 dark:bg-brand-925',
    variantBorder[variant],
  ),
  title: clsx('flex-1 text-14 font-semibold', variantMessage[variant]),
  description: clsx(
    'mt-0.5 text-13 font-normal text-gray-700 dark:text-gray-300',
  ),
  close:
    'shrink-0 cursor-pointer rounded p-1 text-gray-700 dark:text-gray-300 opacity-70 hover:opacity-100 focus:outline-none',
});
