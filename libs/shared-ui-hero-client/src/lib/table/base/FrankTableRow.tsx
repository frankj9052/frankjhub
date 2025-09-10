import { TableRowChildren } from '@frankjhub/shared-ui-hero-ssr';
import { attachStatics } from '@frankjhub/shared-utils';
import { TableRow } from '@heroui/react';

export interface FrankTableRowProps {
  children: TableRowChildren;
}

const FrankTableRowImpl = ({ children }: FrankTableRowProps) => {
  return <TableRow>{children}</TableRow>;
};

export const FrankTableRow = attachStatics(FrankTableRowImpl, TableRow);
