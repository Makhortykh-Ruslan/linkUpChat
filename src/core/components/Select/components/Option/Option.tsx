'use client';

import type { TIdName } from '@core/types';
import type { ReactNode } from 'react';

import { useSelectContext } from '../../context';
import { OptionStyles } from './Option.styles';

export const Option = <V, I>({
  value,
  children,
}: {
  value: TIdName<V, I>;
  children: ReactNode;
}) => {
  const { onSelect, selectedValue } = useSelectContext();

  const isSelected = selectedValue?.id === value.id || false;
  const styles = OptionStyles(isSelected);

  return (
    <div
      data-component="SelectOption"
      onClick={() => onSelect(value)}
      className={styles.component}
    >
      {children}
    </div>
  );
};
