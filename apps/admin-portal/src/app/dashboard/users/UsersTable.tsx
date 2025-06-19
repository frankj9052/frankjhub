'use client';
import { useDispatch, usersSlice, useSelector } from '@/libs/redux';
import { getUsersAllProfileAsync } from '@/libs/redux/slices/usersSlice/thunk';
import {
  getKeyValue,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useEffect } from 'react';

export default function UsersTable() {
  const dispatch = useDispatch();
  const paginatedUsers = useSelector(state => state.users.usersAllProfile);
  const pagination = useSelector(state => state.users.usersAllProfilePagination);
  const state = useSelector(state => state.users.status);
  const loadingState = state === 'loading' ? 'loading' : 'idle';

  const { data, total, pageCount, pageSize, currentPage } = paginatedUsers;

  useEffect(() => {
    dispatch(getUsersAllProfileAsync({ pagination }));
  }, [pagination, dispatch]);

  useEffect(() => {
    console.log('data ===> ', data);
  }, [data]);

  return (
    <Table
      aria-label="async paginated users data"
      bottomContent={
        pageCount > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={currentPage}
              total={total}
              onChange={page => {
                const offset = (page - 1) * pageSize;
                dispatch(usersSlice.actions.setOffset(offset));
              }}
            />
          </div>
        ) : null
      }
    >
      <TableHeader>
        <TableColumn key="id">ID</TableColumn>
        <TableColumn key="userName">User Name</TableColumn>
        <TableColumn key="email">Email</TableColumn>
        <TableColumn key="lastName">Last Name</TableColumn>
        <TableColumn key="firstName">First Name</TableColumn>
        <TableColumn key="middleName">Middle Name</TableColumn>
        <TableColumn key="gender">Gender</TableColumn>
        <TableColumn key="oauthProvider">Provider</TableColumn>
        <TableColumn key="isActive">Active</TableColumn>
      </TableHeader>
      <TableBody
        items={data ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
        emptyContent={'No data to display'}
      >
        {item => (
          <TableRow key={item.id}>
            {columnKey => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
