import {
  EndContent,
  ErrorMessage,
  Height,
  IsInvalid,
  IsRequired,
  Label,
  LabelPlacement,
  Name,
  Placeholder,
  Radius,
  Size,
  StringChangeHandler,
  StringValue,
  Type,
  Variant,
  Width,
} from '@frankjhub/shared-ui-hero-ssr';
import { Input } from '@heroui/react';

export interface FrankInputProps {
  label?: Label;
  type?: Type;
  placeholder?: Placeholder;
  size?: Size;
  isRequired?: IsRequired;
  errorMessage?: ErrorMessage;
  name?: Name;
  labelPlacement?: LabelPlacement;
  variant?: Variant;
  radius?: Radius;
  isInvalid?: IsInvalid;
  endContent?: EndContent;
  width?: Width;
  height?: Height;
  value?: StringValue;
  onValueChange?: StringChangeHandler;
}

export const FrankInput = ({
  label,
  type,
  placeholder,
  size,
  isRequired,
  errorMessage,
  name,
  labelPlacement,
  variant,
  radius,
  isInvalid,
  endContent,
  width,
  height,
  value,
  onValueChange,
}: FrankInputProps) => {
  return (
    <Input
      label={label}
      type={type}
      placeholder={placeholder}
      size={size}
      isRequired={isRequired}
      errorMessage={errorMessage}
      name={name}
      labelPlacement={labelPlacement}
      variant={variant}
      radius={radius}
      isInvalid={isInvalid}
      endContent={endContent}
      width={width}
      height={height}
      value={value}
      onValueChange={onValueChange}
    />
  );
};
