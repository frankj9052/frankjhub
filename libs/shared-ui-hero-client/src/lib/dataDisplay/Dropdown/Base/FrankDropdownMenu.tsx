import { DropdownMenuChildren } from '@frankjhub/shared-ui-hero-ssr';
import { DropdownMenu } from '@heroui/react';

export interface FrankDropdownMenuProps {
  children: DropdownMenuChildren;
}

export const FrankDropdownMenu = ({ children }: FrankDropdownMenuProps) => {
  return <DropdownMenu>{children}</DropdownMenu>;
};
