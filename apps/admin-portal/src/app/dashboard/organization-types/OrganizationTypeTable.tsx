'use client';

import {
  getAllOrganizationTypesAsync,
  organizationTypeSlice,
  useDispatch,
  useSelector,
} from '@/libs/redux';
import { getDefaultTableClassNames } from '@/utils/tableClassnames';
import {
  OrderEnum,
  OrganizationTypeOrderByField,
  OrganizationTypeSchema,
} from '@frankjhub/shared-schema';
import { formatShortDateTime } from '@frankjhub/shared-utils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import { TopContent } from './TopContent';
import { BottomContent } from './BottomContent';
import { FrankModal } from '@frankjhub/shared-ui-hero-client';
import { softDeleteOrganizationType } from '@/services/organizationType';
import { toast } from 'react-toastify';

export const OrganizationTypeTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const paginatedOrgType = useSelector(state => state.organizationType.all);
  const pagination = useSelector(state => state.organizationType.pagination);
  const state = useSelector(state => state.organizationType.status);
  const visibleColumns = useSelector(state => state.organizationType.visibleColumns);
  const columns = useSelector(state => state.organizationType.columns);
  const loadingState = state === 'loading' ? 'loading' : 'idle';
  const [openModal, setOpenModal] = useState<
    | {
        name: string;
        id: string;
      }
    | undefined
  >(undefined);
  const { data } = paginatedOrgType;
  const classNames = useMemo(() => getDefaultTableClassNames(), []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, columns]);

  // 渲染每个record
  const renderCell = useCallback(
    (orgType: OrganizationTypeSchema, columnKey: Key) => {
      const cellValue = orgType[columnKey as keyof OrganizationTypeSchema];

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
                        router.push(`/dashboard/organization-types/edit/${orgType.id}`);
                      }}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      onPress={() => {
                        setOpenModal({
                          name: orgType.name,
                          id: orgType.id,
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
    [router]
  );

  useEffect(() => {
    dispatch(getAllOrganizationTypesAsync({ pagination }));
  }, [pagination, dispatch]);

  return (
    <div>
      <Table
        isCompact
        removeWrapper
        aria-label="async paginated users data"
        selectionMode="single"
        color="secondary"
        topContent={<TopContent />}
        topContentPlacement="outside"
        bottomContent={<BottomContent />}
        bottomContentPlacement="outside"
        classNames={classNames}
        onSortChange={sortDescriptor => {
          const { column, direction } = sortDescriptor;
          if (direction === 'ascending') {
            dispatch(organizationTypeSlice.actions.setOrder(OrderEnum.ASC));
          } else if (direction === 'descending') {
            dispatch(organizationTypeSlice.actions.setOrder(OrderEnum.DESC));
          }
          dispatch(
            organizationTypeSlice.actions.setOrderBy(String(column) as OrganizationTypeOrderByField)
          );
        }}
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
          loadingState={loadingState}
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
        header={'Delete'}
        backdrop="opaque"
        body={<p>Are you sure you want to delete organization type: {openModal?.name}?</p>}
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
            onPress: async () => {
              if (openModal) {
                const result = await softDeleteOrganizationType(openModal.id);
                if (result.status === 'success') {
                  toast.success(result.data);
                  setOpenModal(undefined);
                  dispatch(getAllOrganizationTypesAsync({ pagination }));
                } else if (result.status === 'error') {
                  toast.error(String(result.error));
                }
              }
            },
          },
        ]}
      />
    </div>
  );
};
