import { CheckboxGroup } from '@heroui/react';
import { ReactNode } from 'react';

export type FrankCheckboxGroupProps = {
  children: ReactNode;
  value?: string[];
  onValueChange?: (selected: string[]) => void;
};

/**
 * A wrapper component around @heroui/react CheckboxGroup
 * that manages a group of checkboxes with controlled or uncontrolled selection.
 *
 * @param {ReactNode} children - Checkbox elements to render inside the group.
 * @param {string[]} [value] - Optional. Array of selected checkbox values (controlled mode).
 * @param {(selected: string[]) => void} [onValueChange] - Optional. Callback triggered when the selected values change.
 */
export function FrankCheckboxGroup({ children, value, onValueChange }: FrankCheckboxGroupProps) {
  return (
    <CheckboxGroup value={value} onValueChange={onValueChange}>
      {children}
    </CheckboxGroup>
  );
}

export default FrankCheckboxGroup;
