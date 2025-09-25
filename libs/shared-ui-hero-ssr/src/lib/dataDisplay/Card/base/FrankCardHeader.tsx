import { CardHeader } from '@heroui/react';
import { Children, ClassName } from '../../../../types';

export interface FrankCardHeaderProps {
  children?: Children;
  className?: ClassName;
}

export const FrankCardHeader = ({ children, className }: FrankCardHeaderProps) => {
  return <CardHeader className={className}>{children}</CardHeader>;
};
