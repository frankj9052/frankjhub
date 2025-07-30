'use client';
import { CreateResourceForm } from '@/components/forms/CreateResourceForm';
import { resourceSlice, useDispatch, useSelector } from '@/libs/redux';
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
import { ChangeEvent, useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { MdKeyboardArrowDown } from 'react-icons/md';

export const TopContent = () => {
  const dispatch = useDispatch();
  const visibleColumns = useSelector(state => state.resource.visibleColumns);
  const columns = useSelector(state => state.resource.columns);
  const pagination = useSelector(state => state.resource.pagination);
  const all = useSelector(state => state.resource.all?.data);
  const statusOptions = useSelector(state => state.resource.statusOptions);
  const [searchValue, setSearchValue] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const { limit, filters } = pagination;
  const total = all?.total ?? 0;

  const debouncedSearchChange = useDebouncedCallback((value?: string) => {
    if (value) {
      dispatch(resourceSlice.actions.setSearchValue(value));
      dispatch(resourceSlice.actions.cleanOffset());
    } else {
      dispatch(resourceSlice.actions.cleanSearchValue());
    }
  }, 500);

  useEffect(() => {
    debouncedSearchChange(searchValue);
  }, [dispatch, searchValue, debouncedSearchChange]);

  const handleStatusSelectionChange = (selection: SharedSelection) => {
    const selectionArray = Array.from(selection);
    dispatch(resourceSlice.actions.setStatusFilter(selectionArray as string[]));
  };

  const handleColumnSelectionChange = (keys: SharedSelection) => {
    const selectionArray = Array.from(keys);
    dispatch(resourceSlice.actions.setVisibleColumn(selectionArray));
  };

  const handleCreateNewButtonClick = () => {
    setOpenModal(true);
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(resourceSlice.actions.setLimit(Number(e.target.value)));
    dispatch(resourceSlice.actions.cleanOffset());
  };

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
                onSelectionChange={handleStatusSelectionChange}
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
                onSelectionChange={handleColumnSelectionChange}
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
          <Button variant="solid" color="secondary" onPress={handleCreateNewButtonClick}>
            Create New
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {total} records</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={handlePageSizeChange}
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
        body={<CreateResourceForm onClose={() => setOpenModal(false)} />}
        hideHeaderAndFooter={true}
      />
    </div>
  );
};
