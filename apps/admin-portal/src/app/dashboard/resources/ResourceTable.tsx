'use client';
import {
  resourceSlice,
  getResourceByIdAsync,
  getResourceListAsync,
  useDispatch,
  useSelector,
} from '@/libs/redux';
import { softDeleteResource } from '@/services/resource.service';
import { getDefaultTableClassNames } from '@/utils/tableClassnames';
import { ResourceDto, ResourceOrderByField, OrderEnum } from '@frankjhub/shared-schema';
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
import { FrankModal } from '@frankjhub/shared-ui-hero-client';
import { BottomContent } from './BottomContent';

export const ResourceTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const all = useSelector(state => state.resource.all?.data);
  const pagination = useSelector(state => state.resource.pagination);
  const status = useSelector(state => state.resource.status);
  const visibleColumns = useSelector(state => state.resource.visibleColumns);
  const columns = useSelector(state => state.resource.columns);
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
  const data = all?.data ?? [];
  const classNames = useMemo(() => getDefaultTableClassNames(), []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, columns]);

  const renderCell = useCallback(
    (data: ResourceDto, columnKey: Key) => {
      const cellValue = data[columnKey as keyof ResourceDto];

      switch (columnKey) {
        case 'isActive':
          return cellValue ? (
            <Chip color="success">Active</Chip>
          ) : (
            <Chip color="default">Inactive</Chip>
          );
        case 'createdAt':
        case 'updatedAt':
        case 'deletedAt':
          return cellValue ? (
            <div>{formatShortDateTime(new Date(String(cellValue)))}</div>
          ) : (
            cellValue
          );
        case 'actions':
          return (
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
                      dispatch(getResourceByIdAsync({ id: data.id }));
                      router.push(`/dashboard/resources/edit/${data.id}`);
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
                        body: `Are you sure you want to delete resource: ${data.name}?`,
                      });
                    }}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [router, dispatch]
  );

  useEffect(() => {
    dispatch(getResourceListAsync({ pagination }));
  }, [pagination, dispatch]);

  const handleSortChange = (sortDescriptor: SortDescriptor) => {
    const { column, direction } = sortDescriptor;
    if (direction === 'ascending') {
      dispatch(resourceSlice.actions.setOrder(OrderEnum.ASC));
    } else if (direction === 'descending') {
      dispatch(resourceSlice.actions.setOrder(OrderEnum.DESC));
    }
    dispatch(resourceSlice.actions.setOrderBy(String(column) as ResourceOrderByField));
  };

  const handleSoftDeleteClick = async () => {
    if (openModal) {
      const result = await softDeleteResource(openModal.id);
      if (result.status === 'success') {
        toast.success(result.message);
        setOpenModal(undefined);
        dispatch(getResourceListAsync({ pagination }));
      } else {
        toast.error(String(result.message));
      }
    }
  };

  return (
    <div>
      <Table
        isCompact
        removeWrapper
        aria-label="async paginated resource data"
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
          emptyContent={'No resource found'}
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
        onClose={() => setOpenModal(undefined)}
        header={openModal?.header}
        body={<p>{openModal?.body}</p>}
        footerButtons={[
          {
            color: 'default',
            variant: 'light',
            customizeContent: <div className="h-8 flex items-center justify-center">Cancel</div>,
            onPress: () => setOpenModal(undefined),
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
