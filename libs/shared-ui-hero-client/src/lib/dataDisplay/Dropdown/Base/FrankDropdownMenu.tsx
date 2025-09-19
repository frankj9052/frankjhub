import {
  AriaLabel,
  CloseOnSelect,
  DisallowEmptySelection,
  DropdownMenuChildren,
  OnSelectionChange,
  SelectedKey,
  SelectionMode,
} from '@frankjhub/shared-ui-hero-ssr';
import { DropdownMenu } from '@heroui/react';

export interface FrankDropdownMenuProps {
  children: DropdownMenuChildren;
  disallowEmptySelection?: DisallowEmptySelection;
  ariaLabel?: AriaLabel;
  closeOnSelect?: CloseOnSelect;
  selectedKeys?: SelectedKey;
  selectionMode?: SelectionMode;
  onSelectionChange?: OnSelectionChange;
}

export const FrankDropdownMenu = ({
  children,
  disallowEmptySelection,
  ariaLabel,
  closeOnSelect,
  selectedKeys,
  selectionMode,
  onSelectionChange,
}: FrankDropdownMenuProps) => {
  return (
    <DropdownMenu
      disallowEmptySelection={disallowEmptySelection}
      aria-label={ariaLabel}
      closeOnSelect={closeOnSelect}
      selectedKeys={selectedKeys}
      selectionMode={selectionMode}
      onSelectionChange={onSelectionChange}
    >
      {children}
    </DropdownMenu>
  );
};
