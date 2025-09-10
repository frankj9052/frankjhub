import {
  AriaLabel,
  EmptyContent,
  FrankSpinner,
  GeneralTableColumn,
  LoadingState,
  OnSortChange,
} from '@frankjhub/shared-ui-hero-ssr';
import {
  FrankTableBody,
  FrankTableCell,
  FrankTableColumn,
  FrankTableHeader,
  FrankTableRow,
} from '../base';
import { FrankTable } from '../base/FrankTable';
import { Key, ReactNode } from 'react';

export interface FrankGeneralTableProps<T extends { id: string }> {
  columns: GeneralTableColumn[];
  ariaLabel: AriaLabel;
  data?: T[];
  onSortChange?: OnSortChange;
  loadingState?: LoadingState;
  emptyContent?: EmptyContent;
  renderCell: (item: T, columnKey: Key) => ReactNode;
}
export const FrankGeneralTable = <T extends { id: string }>({
  columns,
  data,
  onSortChange,
  loadingState,
  emptyContent,
  renderCell,
  ariaLabel,
}: FrankGeneralTableProps<T>) => {
  return (
    <FrankTable
      ariaLabel={ariaLabel}
      isCompact
      removeWrapper
      selectionMode="single"
      color="secondary"
      onSortChange={onSortChange}
    >
      <FrankTableHeader columns={columns}>
        {column => (
          <FrankTableColumn key={column.uid} allowsSorting={column.sortable} align={column.align}>
            {column.name}
          </FrankTableColumn>
        )}
      </FrankTableHeader>
      <FrankTableBody
        items={data ?? []}
        loadingContent={<FrankSpinner color="secondary" />}
        loadingState={loadingState}
        emptyContent={emptyContent}
      >
        {item => (
          <FrankTableRow key={item.id}>
            {columnKey => <FrankTableCell>{renderCell(item, columnKey)}</FrankTableCell>}
          </FrankTableRow>
        )}
      </FrankTableBody>
    </FrankTable>
  );
};
