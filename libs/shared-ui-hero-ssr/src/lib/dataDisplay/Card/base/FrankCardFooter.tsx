import { CardFooter } from '@heroui/react';
import { Children } from '../../../../types';

export interface FrankCardFooterProps {
  children?: Children;
}

export const FrankCardFooter = ({ children }: FrankCardFooterProps) => {
  return <CardFooter>{children}</CardFooter>;
};
