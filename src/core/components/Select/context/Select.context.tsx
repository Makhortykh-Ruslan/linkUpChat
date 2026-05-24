'use client';

import { createContext, useContext } from 'react';

import type { TIdName } from '@/src/core/types';

export type Coords = {
  top: number;
  left: number;
  width: number;
};

type SelectContextType<V, I> = {
  isOpen: boolean;
  coords: Coords | null;
  selectedValue: TIdName<V, I> | null;
  toggle: () => void;
  onSelect: (value: TIdName<V, I>) => void;
  setCoords: (coords: Coords) => void;
};

export const SelectContext = createContext<
  SelectContextType<unknown, unknown> | undefined
>(undefined);

export function useSelectContext<V, I>() {
  const context = useContext(SelectContext);
  if (!context)
    throw new Error('Select components must be used within <Select />');

  return context as SelectContextType<V, I>;
}
