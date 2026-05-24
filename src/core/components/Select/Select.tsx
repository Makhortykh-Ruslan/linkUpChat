'use client';

import { type Coords, SelectContext } from '@core/components/Select/context';
import type { TIdName } from '@core/types';
import { type ReactNode, useState } from 'react';

import { Content, Option, Trigger } from './components';

export const Select = <V, I>({
  children,
  onChange,
  value,
}: {
  children: ReactNode;
  onChange: (v: TIdName<V, I>) => void;
  value: TIdName<V, I> | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);

  const toggle = () => setIsOpen(!isOpen);
  const onSelect = (val: TIdName<V, I>) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider
      data-component="Select"
      value={{
        selectedValue: value,
        onSelect: onSelect as (value: TIdName<unknown, unknown>) => void,
        isOpen,
        toggle,
        coords,
        setCoords,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};

Select.Trigger = Trigger;
Select.Content = Content;
Select.Option = Option;
