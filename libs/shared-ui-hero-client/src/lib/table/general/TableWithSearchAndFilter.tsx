import {
  ChangeEvent,
  ComponentType,
  Dispatch,
  Key,
  ReactNode,
  SetStateAction,
  useMemo,
} from 'react';
import {
  FrankTable,
  FrankTableBody,
  FrankTableCell,
  FrankTableColumn,
  FrankTableHeader,
  FrankTableRow,
} from '../base';
import { TopContent } from './TableWithSearchAndFilterParts/TopContent';
import {
  EmptyContent,
  FrankSpinner,
  OnSelectionChange,
  OnSortChange,
  SelectionMode,
  Status,
} from '@frankjhub/shared-ui-hero-ssr';
import { LabeledEnumItem, TableColumn } from '@frankjhub/shared-schema';
import { BottomContent } from './TableWithSearchAndFilterParts/BottomContent';
import FrankModal from '../../feedback/Modal/FrankModal';

function getDefaultTableClassNames() {
  return {
    wrapper: ['max-h-[382px]', 'max-w-3xl'],
    th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
    td: [
      'group-data-[first=true]/tr:first:before:rounded-none',
      'group-data-[first=true]/tr:last:before:rounded-none',
      'group-data-[middle=true]/tr:before:rounded-none',
      'group-data-[last=true]/tr:first:before:rounded-none',
      'group-data-[last=true]/tr:last:before:rounded-none',
    ],
  };
}

interface PartialAll {
  id: string;
}

export interface SimpleModal {
  name: string;
  id: string;
  header: string;
  body: string;
  onPress: () => void;
}

export interface TableWithSearchAndFilterProps<T extends PartialAll> {
  ariaLabel: string;
  searchbar: {
    placeholder: string;
    searchValue: string;
    onClear: () => void;
    onValueChange: Dispatch<SetStateAction<string>>;
  };
  filterList: {
    trigger: string;
    ariaLabel: string;
    selectedKey: Set<string>;
    selectionMode: SelectionMode;
    onSelectionChange: OnSelectionChange;
    dropdownItems: LabeledEnumItem[];
  }[];
  columnSelection: {
    selectedKey: Set<string>;
    onSelectionChange: OnSelectionChange;
    dropdownItems: LabeledEnumItem[];
  };
  total: number;
  handlePageSizeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  limit: number;
  CreateForm: ComponentType<{ onClose: () => void }>;
  currentPage: number;
  pageCount: number;
  handlePageChange: (page: number) => void;
  handleSortChange: OnSortChange;
  headerColumns: TableColumn[];
  status: Status;
  all: T[];
  renderCell: (item: T, key: Key) => ReactNode;
  openModal: SimpleModal | undefined;
  setOpenModal: Dispatch<SetStateAction<SimpleModal | undefined>>;
  emptyContent: EmptyContent;
}

export const TableWithSearchAndFilter = <T extends PartialAll>({
  ariaLabel,
  searchbar,
  filterList,
  columnSelection,
  total,
  handlePageSizeChange,
  limit,
  CreateForm,
  currentPage,
  pageCount,
  handlePageChange,
  handleSortChange,
  headerColumns,
  status,
  all,
  renderCell,
  openModal,
  setOpenModal,
  emptyContent,
}: TableWithSearchAndFilterProps<T>) => {
  const classNames = useMemo(() => getDefaultTableClassNames(), []);
  const loadingStatus = status === 'loading' ? 'loading' : 'idle';
  return (
    <div>
      <FrankTable
        isCompact
        removeWrapper
        ariaLabel={ariaLabel}
        selectionMode="single"
        color="secondary"
        topContent={
          <TopContent
            searchbar={searchbar}
            filterList={filterList}
            columnSelection={columnSelection}
            handlePageSizeChange={handlePageSizeChange}
            CreateForm={CreateForm}
            total={total}
            limit={limit}
          />
        }
        topContentPlacement="outside"
        bottomContent={
          <BottomContent
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
          />
        }
        bottomContentPlacement="outside"
        classNames={classNames}
        onSortChange={handleSortChange}
      >
        <FrankTableHeader columns={headerColumns}>
          {column => (
            <FrankTableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </FrankTableColumn>
          )}
        </FrankTableHeader>
        <FrankTableBody
          items={all ?? []}
          loadingContent={<FrankSpinner color="secondary" />}
          loadingState={loadingStatus}
          emptyContent={emptyContent}
        >
          {item => (
            <FrankTableRow key={item.id}>
              {columnKey => <FrankTableCell>{renderCell(item, columnKey)}</FrankTableCell>}
            </FrankTableRow>
          )}
        </FrankTableBody>
      </FrankTable>
      <FrankModal
        isOpen={!!openModal}
        onClose={() => {
          setOpenModal(undefined);
        }}
        header={openModal?.header}
        body={<p>{openModal?.body}</p>}
        footerButtons={[
          {
            color: 'default',
            variant: 'light',
            customizeContent: <div className="h-8 flex items-center justify-center">Cancel</div>,
            onPress: () => {
              setOpenModal(undefined);
            },
          },
          {
            color: 'secondary',
            variant: 'solid',
            customizeContent: (
              <div className="h-8 flex items-center justify-center">{openModal?.name}</div>
            ),
            onPress: () => {
              if (openModal) {
                openModal.onPress();
              }
            },
          },
        ]}
      />
    </div>
  );
};
