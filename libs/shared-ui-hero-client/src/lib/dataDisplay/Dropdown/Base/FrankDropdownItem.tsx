import { ClassName, DropdownItemKey, OnPress, TextValue } from '@frankjhub/shared-ui-hero-ssr';
import { attachStatics } from '@frankjhub/shared-utils';
import { DropdownItem } from '@heroui/react';
import { ReactNode } from 'react';

export interface FrankDropdownItemProps {
  children: ReactNode;
  key: DropdownItemKey;
  onPress?: OnPress;
  textValue?: TextValue;
  className?: ClassName;
}

const FrankDropdownItemImpl = ({
  children,
  key,
  onPress,
  textValue,
  className,
}: FrankDropdownItemProps) => {
  return (
    <DropdownItem key={key} onPress={onPress} textValue={textValue} className={className}>
      {children}
    </DropdownItem>
  );
};

export const FrankDropdownItem = attachStatics(FrankDropdownItemImpl, DropdownItem);
