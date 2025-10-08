import { ClassName, FrankButton, OnPress, TextValue } from '@frankjhub/shared-ui-hero-ssr';
import { FrankDropdown } from '../Base/FrankDropdown';
import { FrankDropdownMenu } from '../Base/FrankDropdownMenu';
import { FrankDropdownTrigger } from '../Base/FrankDropdownTrigger';
import { HiDotsVertical } from 'react-icons/hi';
import { FrankDropdownItem } from '../Base/FrankDropdownItem';
import { ReactNode } from 'react';

export type ActionsDropdown = {
  key: string;
  onPress: OnPress;
  label: ReactNode;
  textValue: TextValue;
  className?: ClassName;
};

export interface FrankActionsDropdownProps {
  actions: ActionsDropdown[];
}

export const FrankActionsDropdown = ({ actions }: FrankActionsDropdownProps) => {
  return (
    <FrankDropdown className="">
      <FrankDropdownTrigger>
        <FrankButton variant="light" radius="full" size="sm" isIconOnly={true}>
          <HiDotsVertical className="text-default-400" />
        </FrankButton>
      </FrankDropdownTrigger>
      <FrankDropdownMenu>
        {actions.map(action => (
          <FrankDropdownItem
            key={action.key}
            onPress={action.onPress}
            textValue={action.textValue}
            className={action.className}
          >
            {action.label}
          </FrankDropdownItem>
        ))}
      </FrankDropdownMenu>
    </FrankDropdown>
  );
};
