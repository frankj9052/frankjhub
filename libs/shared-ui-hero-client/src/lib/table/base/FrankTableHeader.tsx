import { Columns, TableHeaderChildren } from '@frankjhub/shared-ui-hero-ssr';
import { attachStatics } from '@frankjhub/shared-utils';
import { TableHeader } from '@heroui/react';
export interface FrankTableHeaderProps<T = unknown> {
  children: TableHeaderChildren<T>;
  columns?: Columns<T>;
}
const FrankTableHeaderImpl = <T,>({ children, columns }: FrankTableHeaderProps<T>) => {
  return <TableHeader columns={columns}>{children}</TableHeader>;
};

export const FrankTableHeader = attachStatics(FrankTableHeaderImpl, TableHeader);
