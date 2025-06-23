'use client';
import { useDispatch, usersSlice, useSelector } from '@/libs/redux';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Selection,
  SharedSelection,
} from '@heroui/react';
import { useCallback, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { MdKeyboardArrowDown } from 'react-icons/md';

const statusOptions = [
  { name: 'Active', uid: 'active' },
  { name: 'Inactive', uid: 'inactive' },
  { name: 'Deleted', uid: 'deleted' },
  { name: 'Unverified Email', uid: 'unverifiedEmail' },
  { name: 'Incomplete Profile', uid: 'incompleteProfile' },
];

export const TopContent = () => {
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState<Selection>('all');
  const visibleColumns = useSelector(state => state.users.visibleColumns);
  const columns = useSelector(state => state.users.columns);
  const filterValue = useSelector(state => state.users.usersAllProfilePagination.search);
  const paginatedUsers = useSelector(state => state.users.usersAllProfile);
  const { total, pageSize } = paginatedUsers;

  const onSearchChange = useCallback(
    (value?: string) => {
      if (value) {
        dispatch(usersSlice.actions.setSearchValue(value));
        dispatch(usersSlice.actions.cleanOffset());
      } else {
        dispatch(usersSlice.actions.cleanSearchValue());
      }
    },
    [dispatch]
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          classNames={{
            base: 'w-full sm:max-w-[44%]',
            inputWrapper: 'border-1',
          }}
          placeholder="Search by name..."
          size="sm"
          startContent={<IoSearchOutline className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => {
            dispatch(usersSlice.actions.cleanSearchValue());
          }}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                size="sm"
                variant="flat"
                endContent={<MdKeyboardArrowDown className="text-small" />}
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="status selection"
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode="multiple"
              onSelectionChange={setStatusFilter}
            >
              {statusOptions.map(status => (
                <DropdownItem key={status.uid} className="capitalize">
                  {status.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<MdKeyboardArrowDown className="text-small" />}
                size="sm"
                variant="flat"
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={new Set(visibleColumns) as SharedSelection}
              selectionMode="multiple"
              onSelectionChange={keys => {
                const selectionArray = Array.from(keys);
                dispatch(usersSlice.actions.setVisibleColumn(selectionArray));
              }}
            >
              {columns.map(column => (
                <DropdownItem key={column.uid} className="capitalize">
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">Total {total} users</span>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={e => {
              dispatch(usersSlice.actions.setLimit(Number(e.target.value)));
              dispatch(usersSlice.actions.setOffset(0));
            }}
            value={String(pageSize)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  );
};
