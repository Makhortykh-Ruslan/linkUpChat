import type { TIdName } from '@core/types';
import clsx from 'clsx';

export const TriggerStyles = <V, I>(
  isOpen: boolean,
  selectedValue: TIdName<V, I> | null,
) => ({
  component: clsx(
    `w-full flex items-center bg-gray-50 py-[8px] px-[12px] rounded-[12px] 
  border border-gray-300
  dark:border-brand-800 text-14 h-[40px] dark:bg-brand-900 cursor-pointer transition-all duration-200 ease-in-out'`,
    isOpen &&
      'text-indigo-400 bg-indigo-50 border-indigo-400 dark:bg-brand-700 dark:border-gray-50',
    selectedValue ? 'text-gray-900 dark:text-gray-50' : 'text-gray-500',
  ),
  component_arrow: clsx(
    'transition-transform duration-400 ml-auto w-[24px] h-[24px]',
    isOpen
      ? 'rotate-180 text-indigo-400 dark:text-gray-50'
      : 'rotate-0 text-gray-500',
  ),
});
