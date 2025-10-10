import {
  AllowsCustomValue,
  AriaLabel,
  ClassName,
  ClassNamesForAutocompelete,
  DefaultAutocompleteItem,
  DefaultFilter,
  EndContent,
  ErrorMessage,
  FullWidth,
  InputValue,
  IsClearable,
  IsDisabled,
  IsInvalid,
  IsLoading,
  Label,
  OnBlur,
  OnInputChange,
  OnSelectionChangeForAutocomplete,
  Placeholder,
  Radius,
  SelectedKeyForAutocomplete,
  SelectorIcon,
  Size,
  StartContent,
  VariantForAutocomplete,
} from '@frankjhub/shared-ui-hero-ssr';
import { FrankAutocomplete, FrankAutocompleteItem } from './base';

export interface FrankAutocompleteGeneralProps {
  allowsCustomValue?: AllowsCustomValue;
  ariaLabel?: AriaLabel;
  label?: Label;
  onBlur?: OnBlur;
  isInvalid?: IsInvalid;
  errorMessage?: ErrorMessage;
  className?: ClassName;
  placeholder?: Placeholder;
  defaultItems?: DefaultAutocompleteItem[];
  defaultFilter?: DefaultFilter;
  variant?: VariantForAutocomplete;
  radius?: Radius;
  selectedKey?: SelectedKeyForAutocomplete;
  onSelectionChange?: OnSelectionChangeForAutocomplete;
  inputValue?: InputValue;
  onInputChange?: OnInputChange;
  endContent?: EndContent;
  startContent?: StartContent;
  classNames?: ClassNamesForAutocompelete;
  fullWidth?: FullWidth;
  isLoading?: IsLoading;
  size?: Size;
  isDisabled?: IsDisabled;
  id?: undefined | string;
  isClearable?: IsClearable;
  selectorIcon?: SelectorIcon;
}

export const FrankAutocompleteGeneral = ({
  allowsCustomValue = false,
  ariaLabel,
  label,
  onBlur,
  isInvalid,
  errorMessage,
  className,
  placeholder,
  defaultItems,
  defaultFilter,
  variant,
  radius,
  selectedKey,
  onSelectionChange,
  inputValue,
  onInputChange,
  endContent,
  startContent,
  classNames,
  fullWidth,
  isLoading,
  size,
  isDisabled,
  id,
  isClearable,
  selectorIcon,
}: FrankAutocompleteGeneralProps) => {
  return (
    <FrankAutocomplete
      id={id}
      allowsCustomValue={allowsCustomValue}
      ariaLabel={ariaLabel}
      label={label}
      onBlur={onBlur}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      className={className}
      placeholder={placeholder}
      defaultItems={defaultItems}
      defaultFilter={defaultFilter}
      variant={variant}
      radius={radius}
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
      inputValue={inputValue}
      onInputChange={onInputChange}
      endContent={endContent}
      startContent={startContent}
      classNames={classNames}
      fullWidth={fullWidth}
      isLoading={isLoading}
      size={size}
      isDisabled={isDisabled}
      isClearable={isClearable}
      selectorIcon={selectorIcon}
    >
      {item => (
        <FrankAutocompleteItem key={item.key} textValue={item.textValue}>
          {item.label}
        </FrankAutocompleteItem>
      )}
    </FrankAutocomplete>
  );
};
