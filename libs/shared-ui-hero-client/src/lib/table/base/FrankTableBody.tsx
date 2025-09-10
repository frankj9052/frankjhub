import {
  EmptyContent,
  Items,
  LoadingContent,
  LoadingState,
  TableBodyChildren,
} from '@frankjhub/shared-ui-hero-ssr';
import { attachStatics } from '@frankjhub/shared-utils';
import { TableBody } from '@heroui/react';

export interface FrankTableBodyProps<T = unknown> {
  children: TableBodyChildren<T>;
  items?: Items<T>;
  loadingContent?: LoadingContent;
  loadingState?: LoadingState;
  emptyContent?: EmptyContent;
}

const FrankTableBodyImpl = <T,>({
  children,
  items,
  loadingContent,
  loadingState,
  emptyContent,
}: FrankTableBodyProps<T>) => {
  return (
    <TableBody
      items={items}
      loadingContent={loadingContent}
      loadingState={loadingState}
      emptyContent={emptyContent}
    >
      {children}
    </TableBody>
  );
};

export const FrankTableBody = attachStatics(FrankTableBodyImpl, TableBody);
