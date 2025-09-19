import { IssueInvitationForm } from '@/components/forms/IssueInvitationForm';
import { invitationSlice, useDispatch, useSelector } from '@/libs/redux';
import { useDebouncedCallback } from '@frankjhub/shared-hooks';
import { INVITATION_STATUS, InvitationStatus, makeFiltersToolkit } from '@frankjhub/shared-schema';
import {
  FrankDropdown,
  FrankDropdownItem,
  FrankDropdownMenu,
  FrankDropdownTrigger,
  FrankInput,
  FrankModal,
} from '@frankjhub/shared-ui-hero-client';
import { FrankButton } from '@frankjhub/shared-ui-hero-ssr';
import { SharedSelection } from '@heroui/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { MdKeyboardArrowDown } from 'react-icons/md';

export const TopContent = () => {
  const dispatch = useDispatch();
  const visibleColumns = useSelector(state => state.invitation.visibleColumns);
  const columns = useSelector(state => state.invitation.columns);
  const pagination = useSelector(state => state.invitation.pagination);
  const all = useSelector(state => state.invitation.all);
  const statusOptions = useSelector(state => state.invitation.statusOptions);
  const [searchValue, setSearchValue] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const { limit, filters } = pagination;
  const total = all?.total ?? 0;

  const invitationFiltersToolkit = makeFiltersToolkit({
    status: INVITATION_STATUS,
  });
  const structured = invitationFiltersToolkit.ensureStructured(filters, { onUnknown: 'ignore' });
  const selectedStatus = new Set(structured.any?.find(c => c.key === 'status')?.values ?? []);

  const debouncedSearchChange = useDebouncedCallback((value?: string) => {
    if (value) {
      dispatch(invitationSlice.actions.setSearchValue(value));
      dispatch(invitationSlice.actions.cleanOffset());
    } else {
      dispatch(invitationSlice.actions.cleanSearchValue());
    }
  }, 500);

  useEffect(() => {
    debouncedSearchChange(searchValue);
  }, [dispatch, searchValue, debouncedSearchChange]);

  const handleStatusSelectionChange = (selection: SharedSelection) => {
    const selectionArray = Array.from(selection);
    dispatch(invitationSlice.actions.setStatusFilter(selectionArray as InvitationStatus[]));
  };

  const handleColumnSelectionChange = (keys: SharedSelection) => {
    const selectionArray = Array.from(keys);
    dispatch(invitationSlice.actions.setVisibleColumn(selectionArray));
  };
  const handleCreateNewButtonClick = () => {
    setOpenModal(true);
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(invitationSlice.actions.setLimit(Number(e.target.value)));
    dispatch(invitationSlice.actions.cleanOffset());
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <FrankInput
            isClearable={true}
            classNames={{
              base: 'w-full sm:max-w-[44%]',
              inputWrapper: 'border-1',
            }}
            placeholder="Search by email..."
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
            {/* status filter */}
            <FrankDropdown>
              <FrankDropdownTrigger className="hidden sm:flex">
                <FrankButton
                  size="sm"
                  variant="flat"
                  endContent={<MdKeyboardArrowDown className="text-small" />}
                >
                  Status
                </FrankButton>
              </FrankDropdownTrigger>
              <FrankDropdownMenu
                disallowEmptySelection
                ariaLabel="status selection"
                closeOnSelect={false}
                selectedKeys={selectedStatus}
                selectionMode="multiple"
                onSelectionChange={handleStatusSelectionChange}
              >
                {statusOptions.map(status => (
                  <FrankDropdownItem key={status.uid} textValue={status.uid}>
                    {status.name}
                  </FrankDropdownItem>
                ))}
              </FrankDropdownMenu>
            </FrankDropdown>
          </div>
        </div>

        <div className="w-full flex justify-end">
          <FrankButton variant="solid" color="secondary" onPress={handleCreateNewButtonClick}>
            Create New
          </FrankButton>
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

        <FrankModal
          isOpen={!!openModal}
          onClose={() => setOpenModal(false)}
          backdrop="opaque"
          body={<IssueInvitationForm onClose={() => setOpenModal(false)} />}
          hideHeaderAndFooter
        />
      </div>
    </div>
  );
};
