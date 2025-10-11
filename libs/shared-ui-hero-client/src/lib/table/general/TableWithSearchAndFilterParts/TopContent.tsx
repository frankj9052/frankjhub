import { ChangeEvent, ComponentType, Dispatch, SetStateAction, useState } from 'react';
import { TableTopSearchbar } from './TopContentParts/TableSearchbar';
import { TableTopDropdown } from './TopContentParts/TableTopDropdown';
import {
  FrankButton,
  OnSelectionChange,
  SelectedKey,
  SelectionMode,
} from '@frankjhub/shared-ui-hero-ssr';
import { LabeledEnumItem } from '@frankjhub/shared-schema';
import FrankModal from '../../../feedback/Modal/FrankModal';

export interface TopContentProps {
  searchbar: {
    placeholder: string;
    searchValue: string;
    onClear: () => void;
    onValueChange: Dispatch<SetStateAction<string>>;
  };
  filterList: {
    trigger: string;
    ariaLabel: string;
    selectedKey: SelectedKey;
    selectionMode: SelectionMode;
    onSelectionChange: OnSelectionChange;
    dropdownItems: LabeledEnumItem[];
  }[];
  columnSelection: {
    selectedKey: SelectedKey;
    onSelectionChange: OnSelectionChange;
    dropdownItems: LabeledEnumItem[];
  };
  total: number;
  handlePageSizeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  limit: number;
  CreateForm: ComponentType<{ onClose: () => void }>;
}

export const TopContent = ({
  searchbar,
  filterList,
  columnSelection,
  total,
  handlePageSizeChange,
  limit,
  CreateForm,
}: TopContentProps) => {
  const [openModal, setOpenModal] = useState(false);

  const handleCreateNewButtonClick = () => {
    setOpenModal(true);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <TableTopSearchbar
            placeholder={searchbar.placeholder}
            searchValue={searchbar.searchValue}
            onClear={searchbar.onClear}
            onValueChange={searchbar.onValueChange}
          />
          {/* filters */}
          <div className="flex gap-3">
            {filterList &&
              filterList.map(filter => (
                <TableTopDropdown
                  trigger={filter.trigger}
                  ariaLabel={filter.ariaLabel}
                  selectedKey={filter.selectedKey}
                  selectionMode={filter.selectionMode}
                  onSelectionChange={filter.onSelectionChange}
                  dropdownItems={filter.dropdownItems}
                  key={filter.trigger}
                />
              ))}

            {/* columns selection */}
            <TableTopDropdown
              trigger={'Columns'}
              ariaLabel={'Table Columns'}
              selectedKey={columnSelection.selectedKey}
              selectionMode={'multiple'}
              onSelectionChange={columnSelection.onSelectionChange}
              dropdownItems={columnSelection.dropdownItems}
            />
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
          body={<CreateForm onClose={() => setOpenModal(false)} />}
          hideHeaderAndFooter
          size="4xl"
        />
      </div>
    </div>
  );
};
