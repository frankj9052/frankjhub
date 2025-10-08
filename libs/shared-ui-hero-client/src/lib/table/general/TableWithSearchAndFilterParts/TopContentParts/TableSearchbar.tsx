import { IoSearchOutline } from 'react-icons/io5';
import { FrankInput } from '../../../../form/FormFields/Input/FrankInput';
import { Dispatch, SetStateAction } from 'react';

export interface TableTopSearchbarProps {
  placeholder: string;
  searchValue: string;
  onClear: () => void;
  onValueChange: Dispatch<SetStateAction<string>>;
}
export const TableTopSearchbar = ({
  placeholder,
  searchValue,
  onClear,
  onValueChange,
}: TableTopSearchbarProps) => {
  return (
    <FrankInput
      isClearable={true}
      classNames={{
        base: 'w-full sm:max-w-[44%]',
        inputWrapper: 'border-1',
      }}
      placeholder={placeholder}
      size="sm"
      startContent={<IoSearchOutline className="text-default-300" />}
      value={searchValue}
      variant="bordered"
      onClear={onClear}
      onValueChange={onValueChange}
    />
  );
};
