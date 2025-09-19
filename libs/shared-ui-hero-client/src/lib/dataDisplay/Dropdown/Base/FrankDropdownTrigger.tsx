import { Children, ClassName } from '@frankjhub/shared-ui-hero-ssr';
import { DropdownTrigger } from '@heroui/react';

export interface FrankDropdownTriggerProps {
  children: Children;
  className?: ClassName;
}

export const FrankDropdownTrigger = ({ children, className }: FrankDropdownTriggerProps) => {
  return <DropdownTrigger className={className}>{children}</DropdownTrigger>;
};
