import { CSSProperties, FormEvent, ReactNode } from 'react';

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
export type Radius = 'sm' | 'md' | 'lg' | 'none' | 'full' | undefined;
export type IsInvalid = boolean | undefined;
export type EndContent = ReactNode | undefined;
export type Width = string | number | undefined;
export type Height = string | number | undefined;
export type Children = ReactNode;
export type Content = ReactNode | undefined;
export type ShowArrow = boolean | undefined;
export type ClassName = string | undefined;
export type Color =
  | 'default'
  | 'foreground'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | undefined;
export type ButtonColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | undefined;
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
export type ButtonType = 'button' | 'submit' | 'reset' | undefined;
export type IsLoading = boolean | undefined;

// value & value change
export type StringValue = string | undefined;
export type StringChangeHandler = (value: string) => void | undefined;
