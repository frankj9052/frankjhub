import { Children } from '@frankjhub/shared-ui-hero-ssr';
import { attachStatics } from '@frankjhub/shared-utils';
import { TableCell } from '@heroui/react';

export interface FrankTableCellProps {
  children: Children;
}

const FrankTableCellImpl = ({ children }: FrankTableCellProps) => {
  return <TableCell>{children}</TableCell>;
};

export const FrankTableCell = attachStatics(FrankTableCellImpl, TableCell);
