import { CardBody } from '@heroui/react';
import { Children } from '../../../../types';

export interface FrankCardBodyProps {
  children?: Children;
}

export const FrankCardBody = ({ children }: FrankCardBodyProps) => {
  return <CardBody>{children}</CardBody>;
};
