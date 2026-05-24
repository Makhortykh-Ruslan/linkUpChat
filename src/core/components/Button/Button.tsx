import React from 'react';

import { getButtonStyles } from './Button.styles';
import type { TButtonProps } from './types';

export const Button = ({
  disabled,
  color = 'blue',
  className = '',
  type = 'button',
  children,
  ...restProps
}: TButtonProps) => {
  const styles = getButtonStyles(color, className);

  const classNameComponent =
    `${styles.component} ${styles.component_color}`.trim();

  return (
    <button
      data-component="Button"
      role="button"
      type={type}
      className={classNameComponent}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
};
