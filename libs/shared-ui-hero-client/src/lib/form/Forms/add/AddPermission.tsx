import { AriaLabel, DefaultAutocompleteItem, FrankButton } from '@frankjhub/shared-ui-hero-ssr';
import { FrankAutocompleteGeneral } from '../../FormFields';
import { PermissionOptionList } from '@frankjhub/shared-schema';
import { useMemo, useState } from 'react';

export interface AddPermissionProps {
  /** 当前已选权限数组（受控） */
  value?: string[];
  /** 当选择发生改变时触发（受控） */
  onChange: (next: string[]) => void;
  /** 可选项来源（未提供则空列表） */
  permissionOptionList?: PermissionOptionList;
  /** a11y label（可选） */
  ariaLabel?: AriaLabel;
  /** 错误消息（可选：由上层传入） */
  errorMessage?: string;
  /** 是否禁用（可选） */
  isDisabled?: boolean;
}

export const AddPermission = ({
  value = [],
  onChange,
  permissionOptionList = [],
  ariaLabel,
  errorMessage,
  isDisabled,
}: AddPermissionProps) => {
  const [selectedKey, setSelectedKey] = useState<string | null | number>('');
  const currentKeys = useMemo(() => {
    return value ?? [];
  }, [value]);
  const defaultItems: DefaultAutocompleteItem[] = useMemo(() => {
    const set = new Set(currentKeys);
    return permissionOptionList
      .filter(p => !set.has(p.name))
      .map(p => ({
        label: p.name,
        key: p.name,
        textValue: p.name,
      }));
  }, [permissionOptionList, currentKeys]);

  const handleAdd = () => {
    if (!selectedKey || typeof selectedKey !== 'string') return;
    // 双保险：避免重复
    if (currentKeys.includes(selectedKey)) {
      setSelectedKey('');
      return;
    }
    onChange([...currentKeys, selectedKey]);
    setSelectedKey('');
  };

  const handleRemove = (key: string) => {
    onChange(currentKeys.filter(k => k !== key));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {/* Auto compelete */}
        <FrankAutocompleteGeneral
          label="Select Permission"
          ariaLabel={ariaLabel}
          variant="bordered"
          defaultItems={defaultItems}
          size="sm"
          selectedKey={selectedKey}
          onSelectionChange={setSelectedKey}
          isDisabled={isDisabled}
          endContent={<div />}
        />
        {/* Add Button */}
        <FrankButton color="secondary" isDisabled={!selectedKey || isDisabled} onPress={handleAdd}>
          Add
        </FrankButton>
      </div>
      {/* Added Record */}
      {
        <div className="bg-gray-100 p-3 rounded-lg flex flex-col gap-2">
          <label className="font-semibold text-sm">Basic Required Permissions:</label>
          <ul className=" flex flex-col pl-3 justify-center gap-1">
            {currentKeys.length > 0 ? (
              currentKeys.map(key => (
                <li key={key} className="flex justify-between items-center text-sm">
                  <span>{key}</span>
                  <FrankButton
                    size="sm"
                    variant="light"
                    color="danger"
                    className="h-5"
                    onPress={() => handleRemove(key)}
                    isDisabled={isDisabled}
                  >
                    Remove
                  </FrankButton>
                </li>
              ))
            ) : (
              <span className="text-sm">[]</span>
            )}
          </ul>
        </div>
      }
      {/* Error message */}
      {errorMessage && <p className="text-danger text-sm pl-1">{errorMessage}</p>}
    </div>
  );
};
