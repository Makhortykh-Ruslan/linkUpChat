export const conversationCardStyles = {
  component: (isActive: boolean) =>
    `cursor-pointer w-full flex items-center gap-[12px] px-[16px] py-[12px]
    border-b border-main-border transition duration-200 ease-in-out
    hover:bg-indigo-50 dark:hover:bg-purple-900
    ${isActive ? 'bg-indigo-50 dark:bg-purple-900' : ''}`,

  component_avatar: 'shrink-0',

  component_body: 'flex flex-1 gap-[8px] min-w-0',

  component_info: 'flex flex-col flex-1 gap-[4px] min-w-0',
  component_title: 'text-main-title text-14 font-medium truncate',
  component_message: 'text-main-description text-12 truncate',

  component_meta: 'flex flex-col items-end gap-[6px] shrink-0',
  component_time: 'text-main-description text-11 whitespace-nowrap',
  component_count:
    'min-w-[18px] h-[18px] px-[5px] rounded-full bg-indigo-600 text-11 text-white font-medium flex items-center justify-center',
};
