'use client';
import { useDispatch, usersSlice, useSelector } from '@/libs/redux';
import { getUsersAllProfileAsync } from '@/libs/redux/slices/usersSlice/thunk';
import { OrderEnum, UserAllProfilePayload, UserOrderByField } from '@frankjhub/shared-schema';
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
  User,
} from '@heroui/react';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { TopContent } from './TopContent';
import { BottomContent } from './BottomContent';
import { HiDotsVertical } from 'react-icons/hi';
import { dateToCalendarDate, formatShortDateTime } from '@frankjhub/shared-utils';
import { useRouter } from 'next/navigation';
import { FrankModal } from '@frankjhub/shared-ui-hero-client';
import { softDeleteUser } from '@/services/user';
import { toast } from 'react-toastify';

export default function UsersTable() {
  const dispatch = useDispatch();
  const router = useRouter();
  const paginatedUsers = useSelector(state => state.users.usersAllProfile);
  const pagination = useSelector(state => state.users.usersAllProfilePagination);
  const state = useSelector(state => state.users.status);
  const visibleColumns = useSelector(state => state.users.visibleColumns);
  const columns = useSelector(state => state.users.columns);
  const loadingState = state === 'loading' ? 'loading' : 'idle';
  const [openModal, setOpenModal] = useState<
    | {
        userName: string;
        id: string;
      }
    | undefined
  >(undefined);
  const { data } = paginatedUsers;
  const classNames = useMemo(
    () => ({
      wrapper: ['max-h-[382px]', 'max-w-3xl'],
      th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
      td: [
        // changing the rows border radius
        // first
        'group-data-[first=true]/tr:first:before:rounded-none',
        'group-data-[first=true]/tr:last:before:rounded-none',
        // middle
        'group-data-[middle=true]/tr:before:rounded-none',
        // last
        'group-data-[last=true]/tr:first:before:rounded-none',
        'group-data-[last=true]/tr:last:before:rounded-none',
      ],
    }),
    []
  );

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, columns]);

  // 渲染每个record
  const renderCell = useCallback(
    (user: UserAllProfilePayload, columnKey: Key) => {
      const cellValue = user[columnKey as keyof UserAllProfilePayload];

      switch (columnKey) {
        case 'userName':
          return (
            <User
              avatarProps={{ radius: 'full', size: 'sm', src: user.avatarImage ?? undefined }}
              classNames={{
                description: 'text-default-500',
              }}
              description={user.email}
              name={cellValue}
            >
              {user.email}
            </User>
          );
        case 'dateOfBirth':
          return <div>{dateToCalendarDate(new Date(String(cellValue))).toString()}</div>;
        case 'oauthProvider':
          if (!cellValue) {
            return <Chip color="secondary">Platform</Chip>;
          }
          return <Chip color="secondary">{cellValue}</Chip>;
        case 'isActive':
          if (cellValue) {
            return <Chip color="success">Active</Chip>;
          }
          return <Chip color="default">Inactive</Chip>;
        case 'emailVerified':
          if (cellValue) {
            return <Chip color="success">Verified</Chip>;
          }
          return <Chip color="warning">Unverified</Chip>;
        case 'profileCompleted':
          if (cellValue) {
            return <Chip color="success">Completed</Chip>;
          }
          return <Chip color="warning">Incompleted</Chip>;
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
                      key="view"
                      onPress={() => {
                        router.push(`/dashboard/users/view/${user.id}`);
                      }}
                    >
                      View
                    </DropdownItem>
                    <DropdownItem
                      key="edit"
                      onPress={() => {
                        router.push(`/dashboard/users/edit/${user.id}`);
                      }}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      onPress={() => {
                        setOpenModal({
                          userName: user.userName,
                          id: user.id,
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
    dispatch(getUsersAllProfileAsync({ pagination }));
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
            dispatch(usersSlice.actions.setOrder(OrderEnum.ASC));
          } else if (direction === 'descending') {
            dispatch(usersSlice.actions.setOrder(OrderEnum.DESC));
          }
          dispatch(usersSlice.actions.setOrderBy(String(column) as UserOrderByField));
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
          emptyContent={'No users found'}
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
        body={<p>Are you sure you want to delete user {openModal?.userName}?</p>}
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
                const result = await softDeleteUser(openModal.id);
                if (result.status === 'success') {
                  toast.success(result.data);
                  setOpenModal(undefined);
                  dispatch(getUsersAllProfileAsync({ pagination }));
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
}
