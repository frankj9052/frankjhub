import {
  DropdownMenuProps,
  DropdownProps,
  PressEvent,
  SharedSelection,
  SlotsToClasses,
  SortDescriptor,
  Table,
  TableBodyProps,
  TableHeaderProps,
  TableRow,
} from '@heroui/react';
import { ComponentProps, CSSProperties, FormEvent, ReactNode } from 'react';
import { Key, Selection } from '@react-types/shared';
import { OrderEnum } from '@frankjhub/shared-schema';

export type Label = ReactNode | undefined;
export type Type = string | undefined;
export type Placeholder = string | undefined;
export type Size = 'sm' | 'md' | 'lg' | undefined;
export type IsRequired = boolean | undefined;
export type ErrorMessage = ReactNode | undefined;
export type Name = string | undefined;
export type LabelPlacement = 'outside' | 'outside-left' | 'inside' | undefined;
export type Variant = 'flat' | 'faded' | 'bordered' | 'underlined' | undefined;
export type ButtonVariant =
  | 'flat'
  | 'faded'
  | 'bordered'
  | 'solid'
  | 'light'
  | 'shadow'
  | 'ghost'
  | undefined;
export type PaginationVariant = 'flat' | 'faded' | 'bordered' | 'light' | undefined;

export type Radius = 'sm' | 'md' | 'lg' | 'none' | 'full' | undefined;

export type IsInvalid = boolean | undefined;
export type EndContent = ReactNode | undefined;
export type Width = string | number | undefined;
export type Height = string | number | undefined;
export type Children = ReactNode;
export type TableChildren = NonNullable<ComponentProps<typeof Table>['children']>;
export type TableHeaderChildren<T = unknown> = TableHeaderProps<T>['children'];
export type TableBodyChildren<T = unknown> = TableBodyProps<T>['children'];
export type TableRowChildren = NonNullable<ComponentProps<typeof TableRow>['children']>;
export type DropdownMenuChildren = DropdownMenuProps['children'];
export type DropdownChildren = DropdownProps['children'];
export type Content = ReactNode | undefined;
export type ShowArrow = boolean | undefined;
export type ClassName = string | undefined;

export const COLORS = [
  'default',
  'foreground',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
] as const;

export type Color = (typeof COLORS)[number] | undefined;

export const BUTTON_COLORS = COLORS.filter(c => c !== 'foreground');
export const TABLE_COLORS = BUTTON_COLORS;

export type ButtonColor = (typeof BUTTON_COLORS)[number] | undefined;
export type TableColor = ButtonColor;
export type GeneralColor = ButtonColor;
export type Placement =
  | 'bottom'
  | 'bottom-end'
  | 'bottom-start'
  | 'left'
  | 'left-end'
  | 'left-start'
  | 'right'
  | 'right-end'
  | 'right-start'
  | 'top'
  | 'top-end'
  | 'top-start'
  | undefined;
export type Offset = number | undefined;
export type Delay = number | undefined;
export type CloseDelay = number | undefined;
export type Style = CSSProperties | undefined;
export type OnSubmit = ((event: FormEvent<HTMLFormElement>) => void | Promise<void>) | undefined;
export type DisableRipple = boolean | undefined;
export type TabIndex = number | undefined;
export type AutoComplete =
  | 'on'
  | 'off'
  | 'name'
  | 'honorific-prefix'
  | 'given-name'
  | 'additional-name'
  | 'family-name'
  | 'honorific-suffix'
  | 'nickname'
  | 'username'
  | 'new-password'
  | 'current-password'
  | 'one-time-code'
  | 'organization-title'
  | 'organization'
  | 'email'
  | 'tel'
  | 'tel-country-code'
  | 'tel-national'
  | 'tel-area-code'
  | 'tel-local'
  | 'tel-extension'
  | 'impp'
  | 'street-address'
  | 'address-line1'
  | 'address-line2'
  | 'address-line3'
  | 'address-level1'
  | 'address-level2'
  | 'address-level3'
  | 'address-level4'
  | 'country'
  | 'country-name'
  | 'postal-code'
  | 'cc-name'
  | 'cc-given-name'
  | 'cc-additional-name'
  | 'cc-family-name'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-csc'
  | 'cc-type'
  | 'transaction-currency'
  | 'transaction-amount'
  | 'language'
  | 'bday'
  | 'bday-day'
  | 'bday-month'
  | 'bday-year'
  | 'sex'
  | 'photo'
  | 'webauthn'
  | undefined;
export type InputType =
  | 'text'
  | 'password'
  | 'search'
  | 'tel'
  | 'url'
  | 'email'
  | 'number'
  | 'range'
  | 'date'
  | 'month'
  | 'week'
  | 'time'
  | 'datetime-local'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'color'
  | 'submit'
  | 'reset'
  | 'button'
  | 'image'
  | 'hidden'
  | undefined;
export type InputClassNames =
  | SlotsToClasses<
      | 'label'
      | 'errorMessage'
      | 'input'
      | 'base'
      | 'description'
      | 'mainWrapper'
      | 'inputWrapper'
      | 'innerWrapper'
      | 'clearButton'
      | 'helperWrapper'
    >
  | undefined;
export type ButtonType = 'button' | 'submit' | 'reset' | undefined;
export type IsLoading = boolean | undefined;
export type Status = 'idle' | 'loading' | 'failed';
export type AriaLabel = string | undefined;
export type CloseOnSelect = boolean | undefined;
export type IsDisabled = boolean | undefined;
export type IsIconOnly = boolean | undefined;
export type TextValue = string | undefined;
export type IsClearable = boolean | undefined;
export type StartContent = ReactNode | undefined;
export type OnClear = () => void | undefined;
export type DisallowEmptySelection = boolean | undefined;
// Table
export type IsCompact = boolean | undefined;
export type RemoveWrapper = boolean | undefined;
export type SelectionMode = 'multiple' | 'none' | 'single' | undefined;
export type Columns<T = unknown> = T[] | undefined;
export type Align = 'center' | 'start' | 'end' | undefined;
export type AllowsSorting = boolean | undefined;
export type TopContent = ReactNode | undefined;
export type TopContentPlacement = 'inside' | 'outside' | undefined;
export type BottomContent = TopContent;
export type BottomContentPlacement = TopContentPlacement;
export type TableClassNames =
  | SlotsToClasses<
      | 'table'
      | 'base'
      | 'tbody'
      | 'td'
      | 'tfoot'
      | 'th'
      | 'thead'
      | 'tr'
      | 'wrapper'
      | 'sortIcon'
      | 'emptyWrapper'
      | 'loadingWrapper'
    >
  | undefined;
export type OnSortChange = ((descriptor: SortDescriptor) => any) | undefined;
export type Items<T = unknown> = Iterable<T> | undefined;
export type LoadingContent = ReactNode | undefined;
export type LoadingState =
  | 'error'
  | 'filtering'
  | 'idle'
  | 'loading'
  | 'loadingMore'
  | 'sorting'
  | undefined;
export type EmptyContent = ReactNode | undefined;

export type GeneralTableColumn = {
  name: string;
  uid: string;
  sortable?: boolean;
  align?: Align;
};
export type SelectedKey = 'all' | Iterable<Key> | undefined;
export type OnSelectionChange = (keys: Selection) => void;

// dropdown
export type DropdownItemKey = string | number;
export type OnPress = (e: PressEvent) => void | undefined;
export type DropdownSelection = SharedSelection;

// value & value change
export type StringValue = string | undefined;
export type StringChangeHandler = (value: string) => void | undefined;

// pagination
export type Total = number;
export type ShowControls = boolean | undefined;
export type PaginationClassNames =
  | SlotsToClasses<
      | 'base'
      | 'wrapper'
      | 'item'
      | 'prev'
      | 'next'
      | 'cursor'
      | 'forwardIcon'
      | 'ellipsis'
      | 'chevronNext'
    >
  | undefined;
export type Page = number | undefined;
export type PaginationOnChange = (page: number) => void | undefined;
export type Pagination = {
  limit: number;
  offset: number;
  order: OrderEnum;
  orderBy: string;
  search: string | undefined;
  filters: any;
};

// Card
export type IsBlurred = boolean | undefined;
export type IsFooterBlurred = boolean | undefined;
export type IsPressable = boolean | undefined;
export type Shadow = 'none' | 'sm' | 'md' | 'lg' | undefined;
export type FullWidth = boolean | undefined;
export type IsHoverable = boolean | undefined;
export type DisableAnimation = boolean | undefined;
export type AllowTextSelectionOnPress = boolean | undefined;
export type CardRadius = Exclude<Radius, 'full'>;
