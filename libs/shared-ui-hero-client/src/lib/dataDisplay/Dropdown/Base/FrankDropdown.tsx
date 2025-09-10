import { ClassName, DropdownChildren } from '@frankjhub/shared-ui-hero-ssr';
import { Dropdown } from '@heroui/react';

export interface FrankDropdownProps {
  children: DropdownChildren;
  className?: ClassName;
}

export const FrankDropdown = ({ children, className }: FrankDropdownProps) => {
  return <Dropdown className={className}>{children}</Dropdown>;
};
