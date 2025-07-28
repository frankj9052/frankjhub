import { Autocomplete, AutocompleteItem } from '@heroui/react';
import clsx from 'clsx';
import { Key, ReactNode } from 'react';

export type DefaultAutocompleteItemsType = {
  label: string | ReactNode;
  key: string;
  textValue: string;
  description?: string;
};

/**
 * A customizable Autocomplete component built on top of @heroui/react,
 * with additional style and behavior controls.
 *
 * @param {string} ariaLabel - Accessibility label for the autocomplete input.
 * @param {string} [className] - Optional. Custom className for the wrapper div.
 * @param {string} [placeholder] - Optional. Placeholder text for the input field.
 * @param {DefaultAutocompleteItemsType[]} [defaultItems] - Optional. List of items to display as suggestions.
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
export type FrankAutocompleteProps = {
  allowsCustomValue?: boolean;
  ariaLabel: string;
  className?: string;
  placeholder?: string;
  defaultItems?: DefaultAutocompleteItemsType[];
  defaultFilter?: boolean;
  variant?: 'flat' | 'faded' | 'bordered' | 'underlined' | 'ghost';
  radius?: 'sm' | 'md' | 'lg' | 'none' | 'full';
  selectedKey?: string | null;
  onSelectionChange?: (key: Key | null) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  endContent?: ReactNode;
  startContent?: ReactNode;
  customizeStyles?: {
    inputTextStyle?: string;
    clearButtonStyle?: string;
    contentStyle?: string;
  };
  width?: number;
  height?: number;
};

export function FrankAutocomplete({
  allowsCustomValue = false,
  ariaLabel,
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
  customizeStyles,
  width,
  height,
}: FrankAutocompleteProps) {
  return (
    <div
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }}
    >
      <Autocomplete
        allowsCustomValue={allowsCustomValue}
        aria-hidden={false}
        className="h-full"
        placeholder={placeholder}
        defaultItems={defaultItems ?? []}
        variant={variant === 'ghost' ? 'bordered' : variant}
        inputProps={{
          classNames: {
            label: 'hidden',
            inputWrapper: clsx('h-full min-h-0', {
              'border-none shadow-none': variant === 'ghost',
              'border-1': variant !== 'ghost',
            }),
            input: `${
              customizeStyles?.inputTextStyle ? customizeStyles.inputTextStyle : 'text-[13px]'
            }`,
          },
        }}
        radius={radius}
        popoverProps={{
          radius: 'sm',
          classNames: {
            content: `${customizeStyles?.contentStyle ? customizeStyles.contentStyle : ''}`,
          },
        }}
        classNames={{
          selectorButton: clsx('h-[20px] min-w-0 w-[20px]', {
            hidden: !!endContent || !!startContent,
          }),
          endContentWrapper: 'aspect-square flex items-center justify-center',
          clearButton: `${
            customizeStyles?.clearButtonStyle
              ? customizeStyles.clearButtonStyle
              : 'min-w-0 w-[20px] h-[20px]'
          }`,
        }}
        endContent={endContent}
        startContent={startContent}
        fullWidth
        selectedKey={selectedKey}
        onSelectionChange={onSelectionChange}
        inputValue={inputValue}
        onInputChange={onInputChange}
        aria-label={ariaLabel}
        {...(!defaultFilter && { defaultFilter: () => true })}
      >
        {item => (
          <AutocompleteItem key={item.key} textValue={item.textValue}>
            {item.label}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}

export default FrankAutocomplete;
