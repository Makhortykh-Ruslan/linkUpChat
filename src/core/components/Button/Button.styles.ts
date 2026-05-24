import clsx from 'clsx';

import type { TBtnColor } from './types';

export const getButtonStyles = (color: TBtnColor, className: string) => ({
  component: clsx(
    `flex items-center justify-center transition-all
    duration-300 ease-in-out cursor-pointer active:scale-95
    disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100`,
    color !== 'transparent' &&
      `rounded-[16px] text-16 font-medium h-[44px] w-full text-white`,
  ),
  component_color: clsx(
    color === 'blue' && 'bg-indigo-600 hover:enabled:bg-indigo-900',
    color === 'red' && 'bg-red-600 hover:enabled:bg-red-900',
    color === 'transparent' && 'text-indigo-400 hover:enabled:text-indigo-700',
    className,
  ),
});
