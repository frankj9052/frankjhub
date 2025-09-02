import { ReactNode } from 'react';

export type Label = ReactNode | undefined;
export type Type = string | undefined;
export type Placeholder = string | undefined;
export type Size = 'sm' | 'md' | 'lg' | undefined;
export type IsRequired = boolean | undefined;
export type ErrorMessage = ReactNode | undefined;
export type Name = string | undefined;
export type LabelPlacement = 'outside' | 'outside-left' | 'inside' | undefined;
export type Variant = 'flat' | 'faded' | 'bordered' | 'underlined' | undefined;
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

// value & value change
export type StringValue = string | undefined;
export type StringChangeHandler = (value: string) => void | undefined;
