import { DropdownTrigger } from '@heroui/react';
import { ReactNode } from 'react';

export interface FrankDropdownTriggerProps {
  children: ReactNode;
}

export const FrankDropdownTrigger = ({ children }: FrankDropdownTriggerProps) => {
  return <DropdownTrigger>{children}</DropdownTrigger>;
};
