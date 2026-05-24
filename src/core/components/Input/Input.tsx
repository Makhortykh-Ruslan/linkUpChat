'use client';

import React, { forwardRef, type MouseEvent, useState } from 'react';

import { Icon } from '../Icon/Icon';
import { getInputStyles } from './Input.styles';
import type { TInputProps } from './types';

export const Input = forwardRef<HTMLInputElement, TInputProps>(
  (
    {
      id,
      label,
      error,
      className = '',
      leftIcon,
      rightIcon,
      isPasswordFlow,
      type = 'text',
      ...restProps
    }: TInputProps,
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isError = !!error;
    const styles = getInputStyles(isError, className);

    const currentType = isPasswordFlow
      ? isPasswordVisible
        ? 'text'
        : 'password'
      : type;
    const currentRightIcon = isPasswordFlow
      ? isPasswordVisible
        ? 'eye-open'
        : 'eye-close'
      : rightIcon;

    const handleTogglePassword = (e: MouseEvent) => {
      e.preventDefault();
      setIsPasswordVisible(!isPasswordVisible);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsPasswordVisible(!isPasswordVisible);
      }
    };

    const component_input_wrapper = label
      ? 'mt-[10px] ' + styles.component_input_wrapper
      : styles.component_input_wrapper;

    return (
      <div data-component="Input" className={styles.component}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}

        <div className={component_input_wrapper}>
          {leftIcon && <Icon name={leftIcon} className={styles.icon} />}

          <input
            ref={ref}
            id={id}
            className={styles.input}
            type={currentType}
            {...restProps}
          />

          {currentRightIcon && (
            <button
              type="button"
              onKeyDown={handleKeyDown}
              onMouseDown={handleTogglePassword}
              className={
                isPasswordFlow ? 'cursor-pointer' : 'pointer-events-none'
              }
            >
              <Icon name={currentRightIcon} className={styles.icon} />
            </button>
          )}
        </div>

        {isError && <p className={styles.error}>{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
