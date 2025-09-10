import { Align, AllowsSorting, Children } from '@frankjhub/shared-ui-hero-ssr';
import { attachStatics } from '@frankjhub/shared-utils';
import { TableColumn } from '@heroui/react';

export interface FrankTableColumnProps {
  children: Children;
  align?: Align;
  allowsSorting?: AllowsSorting;
}

const FrankTableColumnImpl = ({ children, align, allowsSorting }: FrankTableColumnProps) => {
  return (
    <TableColumn align={align} allowsSorting={allowsSorting}>
      {children}
    </TableColumn>
  );
};

export const FrankTableColumn = attachStatics(FrankTableColumnImpl, TableColumn);
