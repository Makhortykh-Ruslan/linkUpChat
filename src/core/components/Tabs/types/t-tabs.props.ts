export type TTab<T extends string = string> = {
  name: string;
  id: T;
};

export type TTabsProps<T extends string = string> = {
  activeTabId: T;
  tabs: readonly TTab<T>[];
  onChangeTab: (event: TTab<T>) => void;
};
