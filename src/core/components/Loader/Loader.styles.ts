import type { TLoaderSize } from '@core/components/Loader/types';
import clsx from 'clsx';

export const geLoaderStyle = (
  className: string | undefined,
  size: TLoaderSize,
) => ({
  component: clsx(
    'animate-spin rounded-full border-gray-300 border-t-indigo-900',
    className,
    size === 'small' && 'w-5 h-5 border-2',
    size === 'medium' && 'w-8 h-8 border-2',
    size === 'large' && 'w-12 h-12 border-4',
  ),
});
