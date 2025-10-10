import {
  AllowsCustomValue,
  AriaLabel,
  AutocompleteChildren,
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
import { Autocomplete } from '@heroui/react';

/**
 * A customizable Autocomplete component built on top of @heroui/react,
 * with additional style and behavior controls.
 *
 * @param {string} ariaLabel - Accessibility label for the autocomplete input.
 * @param {string} [className] - Optional. Custom className for the wrapper div.
 * @param {string} [placeholder] - Optional. Placeholder text for the input field.
 * @param {DefaultAutocompleteItem[]} [defaultItems] - Optional. List of items to display as suggestions.
 * @param {boolean} [defaultFilter=true] - Optional. Whether to use the default filtering behavior.
 * @param {"flat" | "faded" | "bordered" | "underlined" | "ghost"} [variant] - Optional. Visual style variant of the input.
 * @param {"sm" | "md" | "lg" | "none" | "full"} [radius] - Optional. Border radius of the input field.
 * @param {string | null} [selectedKey] - Optional. Currently selected item key.
 * @param {(key: Key | null) => void} [onSelectionChange] - Optional. Callback triggered when the selection changes.
 * @param {string} [inputValue] - Optional. Current value of the input field.
 * @param {(value: string) => void} [onInputChange] - Optional. Callback triggered when the input value changes.
 * @param {ReactNode} [endContent] - Optional. Element displayed at the end of the input.
 * @param {ReactNode} [startContent] - Optional. Element displayed at the start of the input.
 * @param {object} [customizeStyles] - Optional. Custom styles for input text, clear button, and content area.
 * @param {number} [width] - Optional. Width of the component in pixels.
 * @param {number} [height] - Optional. Height of the component in pixels.
 */
export type FrankAutocompleteProps<T extends DefaultAutocompleteItem> = {
  children: AutocompleteChildren<T>;
  allowsCustomValue?: AllowsCustomValue;
  ariaLabel?: AriaLabel;
  label?: Label;
  onBlur?: OnBlur;
  isInvalid?: IsInvalid;
  errorMessage?: ErrorMessage;
  className?: ClassName;
  placeholder?: Placeholder;
  defaultItems?: T[];
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
  id?: string | undefined;
  isClearable?: IsClearable;
  selectorIcon?: SelectorIcon;
};

export function FrankAutocomplete<T extends DefaultAutocompleteItem>({
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
  children,
  id,
  isClearable,
  selectorIcon,
}: FrankAutocompleteProps<T>) {
  return (
    <Autocomplete
      id={id}
      allowsCustomValue={allowsCustomValue}
      aria-label={ariaLabel}
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
      {children}
    </Autocomplete>
  );
}

export default FrankAutocomplete;
