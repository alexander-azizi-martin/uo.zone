'use client';

import {
  type ComponentPropsWithoutRef,
  createContext,
  type ElementRef,
  forwardRef,
  type PropsWithChildren,
  useCallback,
  useContext,
} from 'react';

import { DropdownMenuCheckboxItem as DropdownMenuPrimitiveCheckboxItem } from './dropdown-menu';

const CheckboxGroupContext = createContext<{
  isChecked: (value: string) => boolean;
  toggleValue: (value: string) => void;
} | null>(null);

export interface DropdownMenuCheckboxGroupProps extends PropsWithChildren {
  values: string[];
  onValuesChange: (values: string[]) => void;
}

export const DropdownMenuCheckboxGroup = ({
  children,
  values,
  onValuesChange,
}: DropdownMenuCheckboxGroupProps) => {
  const toggleValue = useCallback(
    (value: string) => {
      const hasValue = values.includes(value);

      const newValues = hasValue
        ? values.filter((v) => v !== value)
        : [...values, value];

      onValuesChange(newValues);
    },
    [values, onValuesChange],
  );

  const isChecked = useCallback(
    (value: string) => {
      return values.includes(value);
    },
    [values],
  );

  return (
    <CheckboxGroupContext.Provider value={{ isChecked, toggleValue }}>
      {children}
    </CheckboxGroupContext.Provider>
  );
};

export interface DropdownMenuCheckboxItemProps
  extends Omit<
    ComponentPropsWithoutRef<typeof DropdownMenuPrimitiveCheckboxItem>,
    'checked' | 'onCheckedChange'
  > {
  value: string;
}

export const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitiveCheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ value, ...props }, ref) => {
  const checkboxContext = useContext(CheckboxGroupContext);

  if (checkboxContext === null) {
    throw new Error(
      `\`DropdownMenuCheckboxItem\` must be used within \`DropdownMenuCheckboxGroup\``,
    );
  }

  return (
    <DropdownMenuPrimitiveCheckboxItem
      ref={ref}
      {...props}
      checked={checkboxContext.isChecked(value)}
      onCheckedChange={() => checkboxContext.toggleValue(value)}
    />
  );
});
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitiveCheckboxItem.displayName;
