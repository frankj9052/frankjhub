import { CreateOrganizationTypeForm } from '@/components/forms/CreateOrganizationTypeForm';
import { organizationTypeSlice, useDispatch, useSelector } from '@/libs/redux';
import { useDebouncedCallback } from '@frankjhub/shared-hooks';
import { FrankModal } from '@frankjhub/shared-ui-hero-client';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  SharedSelection,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { MdKeyboardArrowDown } from 'react-icons/md';

export const TopContent = () => {
  const dispatch = useDispatch();
  const visibleColumns = useSelector(state => state.organizationType.visibleColumns);
  const columns = useSelector(state => state.organizationType.columns);
  const pagination = useSelector(state => state.organizationType.pagination);
  const paginatedUsers = useSelector(state => state.organizationType.all?.data);
  const statusOptions = useSelector(state => state.organizationType.statusOptions);
  const [searchValue, setSearchValue] = useState('');
  const { limit, filters } = pagination;
  const total = paginatedUsers?.total;
  const [openModal, setOpenModal] = useState(false);

  const debouncedSearchChange = useDebouncedCallback((value?: string) => {
    if (value) {
      dispatch(organizationTypeSlice.actions.setSearchValue(value));
      dispatch(organizationTypeSlice.actions.cleanOffset());
    } else {
      dispatch(organizationTypeSlice.actions.cleanSearchValue());
    }
  }, 500);

  useEffect(() => {
    debouncedSearchChange(searchValue);
  }, [dispatch, searchValue, debouncedSearchChange]);

  return (
    <div className="flex flex-col gap-2">
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
            value={searchValue}
            variant="bordered"
            onClear={() => {
              setSearchValue('');
            }}
            onValueChange={setSearchValue}
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
                selectedKeys={new Set(filters)}
                selectionMode="multiple"
                onSelectionChange={selection => {
                  const selectionArray = Array.from(selection);
                  dispatch(
                    organizationTypeSlice.actions.setStatusFilter(selectionArray as string[])
                  );
                }}
              >
                {statusOptions.map(status => (
                  <DropdownItem key={status.uid}>{status.name}</DropdownItem>
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
                  dispatch(organizationTypeSlice.actions.setVisibleColumn(selectionArray));
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
        <div className="w-full flex justify-end">
          <Button
            variant="solid"
            color="secondary"
            onPress={() => {
              setOpenModal(true);
            }}
          >
            Create New
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {total} records</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={e => {
                dispatch(organizationTypeSlice.actions.setLimit(Number(e.target.value)));
                dispatch(organizationTypeSlice.actions.cleanOffset());
              }}
              value={String(limit)}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
      <FrankModal
        isOpen={!!openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        backdrop="opaque"
        body={<CreateOrganizationTypeForm onClose={() => setOpenModal(false)} />}
        hideHeaderAndFooter={true}
      />
    </div>
  );
};
