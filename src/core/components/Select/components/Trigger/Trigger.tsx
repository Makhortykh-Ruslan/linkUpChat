'use client';

import { Icon } from '@core/components';
import React from 'react';

import { useSelectContext } from '../../context';
import { TriggerStyles } from './Trigger.styles';

export const Trigger = <V extends string, I extends string>({
  placeholder,
}: {
  placeholder: string;
}) => {
  const { isOpen, toggle, setCoords, selectedValue } = useSelectContext<V, I>();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setCoords({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    });

    toggle();
  };

  const styles = TriggerStyles(isOpen, selectedValue);

  return (
    <button
      data-component="SelectTrigger"
      onClick={handleClick}
      className={styles.component}
    >
      {selectedValue?.value || placeholder}

      <Icon name="arrow-down" className={styles.component_arrow} />
    </button>
  );
};
