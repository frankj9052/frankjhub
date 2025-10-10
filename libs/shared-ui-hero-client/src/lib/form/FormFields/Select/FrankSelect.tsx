import { IsDisabled } from '@frankjhub/shared-ui-hero-ssr';
import { Select, SelectItem, SharedSelection } from '@heroui/react';

/**
 * Represents a single selectable item for the FrankSelect component.
 */
export type SelectItemType = {
  key: string;
  label: string;
};

/**
 * Props for the FrankSelect component, a wrapper around @heroui/react's Select component.
 */
export type FrankSelectProps = {
  className?: string;
  label?: string;
  ariaLabel?: string;
  placeholder?: string;
  selectionMode?: 'multiple' | 'single';
  selectedKeys?: string[];
  onSelectionChange?: (sharedSelection: SharedSelection) => void;
  items: SelectItemType[];
  size?: 'lg' | 'md' | 'sm';
  width?: number;
  onBlur?: () => void;
  isInvalid?: boolean;
  errorMessage?: string;
  disallowEmptySelection?: boolean;
  variant?: 'flat' | 'faded' | 'bordered' | 'underlined';
  isDisabled?: IsDisabled;
};

/**
 * A reusable wrapper around the @heroui/react Select component,
 * providing a typed and user-friendly interface for single or multiple selection.
 *
 * @param className - Optional custom CSS class for styling the select component.
 * @param label - Optional visible label rendered above the select field.
 * @param ariaLabel - Optional ARIA label used for accessibility (if `label` is not rendered).
 * @param placeholder - Text shown when no item is selected.
 * @param selectionMode - Selection behavior: 'single' (default) or 'multiple'.
 * @param selectedKeys - An array of currently selected item keys (controlled).
 * @param onSelectionChange - Callback function triggered when selection changes.
 * @param items - The list of options to display in the select dropdown.
 * @param size - Size of the select field: 'lg', 'md', or 'sm'.
 * @param width - Optional fixed width for the select component in pixels. Defaults to 100%.
 * @param {'flat' | 'faded' | 'bordered' | 'underlined'} [props.variant] - 视觉风格。
 *
 * @returns A JSX.Element representing the FrankSelect dropdown component.
 */
export const FrankSelect = ({
  className,
  label,
  ariaLabel,
  placeholder,
  selectionMode,
  selectedKeys,
  onSelectionChange,
  items,
  size,
  width,
  onBlur,
  isInvalid,
  errorMessage,
  disallowEmptySelection,
  variant,
  isDisabled,
}: FrankSelectProps) => {
  return (
    <div
      style={{
        width: width ? `${width}px` : '100%',
      }}
    >
      <Select
        className={className}
        label={label}
        aria-label={ariaLabel}
        placeholder={placeholder}
        selectionMode={selectionMode ?? 'single'}
        selectedKeys={selectedKeys ? new Set(selectedKeys) : undefined}
        onSelectionChange={onSelectionChange}
        items={items}
        size={size}
        onBlur={onBlur}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        disallowEmptySelection={!!disallowEmptySelection}
        variant={variant}
        isDisabled={isDisabled}
      >
        {item => <SelectItem key={item.key}>{item.label}</SelectItem>}
      </Select>
    </div>
  );
};
