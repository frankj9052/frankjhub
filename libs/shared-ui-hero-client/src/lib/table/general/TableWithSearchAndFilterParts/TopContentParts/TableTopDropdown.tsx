import { MdKeyboardArrowDown } from 'react-icons/md';
import { FrankDropdown } from '../../../../dataDisplay/Dropdown/Base/FrankDropdown';
import { FrankDropdownTrigger } from '../../../../dataDisplay/Dropdown/Base/FrankDropdownTrigger';
import {
  FrankButton,
  OnSelectionChange,
  SelectedKey,
  SelectionMode,
} from '@frankjhub/shared-ui-hero-ssr';
import { FrankDropdownMenu } from '../../../../dataDisplay/Dropdown/Base/FrankDropdownMenu';
import { FrankDropdownItem } from '../../../../dataDisplay/Dropdown/Base/FrankDropdownItem';
import { LabeledEnumItem } from '@frankjhub/shared-schema';

export interface TableTopDropdownProps {
  trigger: string;
  ariaLabel: string;
  selectedKey: SelectedKey;
  selectionMode: SelectionMode;
  onSelectionChange: OnSelectionChange;
  dropdownItems: LabeledEnumItem[];
}

export const TableTopDropdown = ({
  trigger,
  ariaLabel,
  selectedKey,
  selectionMode,
  onSelectionChange,
  dropdownItems,
}: TableTopDropdownProps) => {
  return (
    <FrankDropdown>
      <FrankDropdownTrigger className="hidden sm:flex">
        <FrankButton
          size="sm"
          variant="flat"
          endContent={<MdKeyboardArrowDown className="text-small" />}
        >
          {trigger}
        </FrankButton>
      </FrankDropdownTrigger>
      <FrankDropdownMenu
        disallowEmptySelection
        ariaLabel={ariaLabel}
        closeOnSelect={false}
        selectedKeys={selectedKey}
        selectionMode={selectionMode}
        onSelectionChange={onSelectionChange}
      >
        {dropdownItems.map(item => (
          <FrankDropdownItem key={item.uid} textValue={item.uid}>
            {item.name}
          </FrankDropdownItem>
        ))}
      </FrankDropdownMenu>
    </FrankDropdown>
  );
};
