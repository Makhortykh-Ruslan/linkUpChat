import type { TIconProps } from './types';

export const Icon = ({ name, className = '', onClick }: TIconProps) => {
  return (
    <svg
      data-component="Icon"
      preserveAspectRatio="xMidYMid meet"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      className={`inline-block shrink-0 ${className} lu-icon`}
      aria-hidden="true"
      onClick={onClick}
    >
      <use href={`/icons/sprite.svg#icon-${name}`} />
    </svg>
  );
};
