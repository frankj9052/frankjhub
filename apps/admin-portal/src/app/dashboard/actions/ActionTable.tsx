'use client';
import {
  actionSlice,
  getActionByIdAsync,
  getActionListAsync,
  useDispatch,
  useSelector,
} from '@/libs/redux';
import { softDeleteAction } from '@/services/action.service';
import { getDefaultTableClassNames } from '@/utils/tableClassnames';
import { ActionDto, ActionOrderByField, OrderEnum } from '@frankjhub/shared-schema';
import { formatShortDateTime } from '@frankjhub/shared-utils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { TopContent } from './TopContent';
import { BottomContent } from './BottomContent';
import { FrankModal } from '@frankjhub/shared-ui-hero-client';

export const ActionTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const all = useSelector(state => state.action.all);
  const pagination = useSelector(state => state.action.pagination);
  const status = useSelector(state => state.action.status);
  const visibleColumns = useSelector(state => state.action.visibleColumns);
  const columns = useSelector(state => state.action.columns);
  const loadingStatus = status === 'loading' ? 'loading' : 'idle';
  const [openModal, setOpenModal] = useState<
    | {
        name: string;
        id: string;
        header: string;
        body: string;
      }
    | undefined
  >(undefined);
  const { data } = all;
  const classNames = useMemo(() => getDefaultTableClassNames(), []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, columns]);

  // 渲染每个record
  const renderCell = useCallback(
    (data: ActionDto, columnKey: Key) => {
      const cellValue = data[columnKey as keyof ActionDto];

      switch (columnKey) {
        case 'isActive':
          if (cellValue) {
            return <Chip color="success">Active</Chip>;
          }
          return <Chip color="default">Inactive</Chip>;
        case 'createdAt':
        case 'updatedAt':
        case 'deletedAt':
          if (cellValue) {
            return <div>{formatShortDateTime(new Date(String(cellValue)))}</div>;
          }
          return cellValue;
        case 'actions':
          return (
            <div>
              <div className="relative flex justify-end items-center gap-2">
                <Dropdown className="bg-background border-1 border-default-200">
                  <DropdownTrigger>
                    <Button isIconOnly radius="full" size="sm" variant="light">
                      <HiDotsVertical className="text-default-400" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      key="edit"
                      onPress={() => {
                        dispatch(getActionByIdAsync({ id: data.id }));
                        router.push(`/dashboard/actions/edit/${data.id}`);
                      }}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      onPress={() => {
                        setOpenModal({
                          name: data.name,
                          id: data.id,
                          header: 'Delete',
                          body: `Are you sure you want to delete action: ${data.name}?`,
                        });
                      }}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [router, dispatch]
  );

  useEffect(() => {
    dispatch(getActionListAsync({ pagination }));
  }, [pagination, dispatch]);

  const handleSortChange = (sortDescriptor: SortDescriptor) => {
    const { column, direction } = sortDescriptor;
    if (direction === 'ascending') {
      dispatch(actionSlice.actions.setOrder(OrderEnum.ASC));
    } else if (direction === 'descending') {
      dispatch(actionSlice.actions.setOrder(OrderEnum.DESC));
    }
    dispatch(actionSlice.actions.setOrderBy(String(column) as ActionOrderByField));
  };
  const handleSoftDeleteClick = async () => {
    if (openModal) {
      const result = await softDeleteAction(openModal.id);
      if (result.status === 'success') {
        toast.success(result.data.message);
        setOpenModal(undefined);
        dispatch(getActionListAsync({ pagination }));
      } else if (result.status === 'error') {
        toast.error(String(result.error));
      }
    }
  };

  return (
    <div>
      <Table
        isCompact
        removeWrapper
        aria-label="async paginated organization data"
        selectionMode="single"
        color="secondary"
        topContent={<TopContent />}
        topContentPlacement="outside"
        bottomContent={<BottomContent />}
        bottomContentPlacement="outside"
        classNames={classNames}
        onSortChange={handleSortChange}
      >
        <TableHeader columns={headerColumns}>
          {column => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'action' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={data ?? []}
          loadingContent={<Spinner color="secondary" />}
          loadingState={loadingStatus}
          emptyContent={'No organization type found'}
        >
          {item => (
            <TableRow key={item.id}>
              {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
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
            color: 'danger',
            variant: 'solid',
            customizeContent: <div className="h-8 flex items-center justify-center">Delete</div>,
            onPress: handleSoftDeleteClick,
          },
        ]}
      />
    </div>
  );
};
