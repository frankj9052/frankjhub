'use client';
import {
  roleSlice,
  getRoleByIdAsync,
  getRoleListAsync,
  useDispatch,
  useSelector,
} from '@/libs/redux';
import { softDeleteRole } from '@/services/role.service';
import { getDefaultTableClassNames } from '@/utils/tableClassnames';
import { RoleDto, OrderEnum, RoleOrderByFields } from '@frankjhub/shared-schema';
import { formatShortDateTime, formatValue } from '@frankjhub/shared-utils';
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
import { FrankModal } from '@frankjhub/shared-ui-hero-client';
import { TopContent } from './TopContent';
import { BottomContent } from './BottomContent';

export const RoleTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const all = useSelector(state => state.role.all?.data);
  const pagination = useSelector(state => state.role.pagination);
  const status = useSelector(state => state.role.status);
  const visibleColumns = useSelector(state => state.role.visibleColumns);
  const columns = useSelector(state => state.role.columns);

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
    (row: RoleDto, columnKey: Key) => {
      const cellValue = row[columnKey as keyof RoleDto];

      switch (columnKey) {
        case 'permissions':
          // Render list of permission names or a count fallback
          if (Array.isArray(cellValue)) {
            const names = cellValue
              .map(p =>
                typeof p === 'object' && p !== null && 'name' in p ? String(p.name) : String(p)
              )
              .join(', ');
            return <span className="line-clamp-2">{names || '-'}</span>;
          }
          return <span>-</span>;

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
                      dispatch(getRoleByIdAsync({ id: row.id }));
                      router.push(`/dashboard/roles/edit/${row.id}`);
                    }}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    onPress={() => {
                      setOpenModal({
                        name: row.name,
                        id: row.id,
                        header: 'Delete',
                        body: `Are you sure you want to delete role: ${row.name}?`,
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
          return <span>{formatValue(cellValue)}</span>;
      }
    },
    [router, dispatch]
  );

  useEffect(() => {
    dispatch(getRoleListAsync({ pagination }));
  }, [pagination, dispatch]);

  const handleSortChange = (sortDescriptor: SortDescriptor) => {
    const { column, direction } = sortDescriptor;
    if (direction === 'ascending') {
      dispatch(roleSlice.actions.setOrder(OrderEnum.ASC));
    } else if (direction === 'descending') {
      dispatch(roleSlice.actions.setOrder(OrderEnum.DESC));
    }
    dispatch(roleSlice.actions.setOrderBy(String(column) as RoleOrderByFields));
  };

  const handleSoftDeleteClick = async () => {
    if (!openModal) return;
    const result = await softDeleteRole(openModal.id);
    if (result.status === 'success') {
      toast.success(result.message);
      setOpenModal(undefined);
      dispatch(getRoleListAsync({ pagination }));
    } else {
      toast.error(String(result.message));
    }
  };

  return (
    <div>
      <Table
        isCompact
        removeWrapper
        aria-label="async paginated role data"
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
          emptyContent={'No role found'}
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
