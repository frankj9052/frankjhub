import { Input } from '@heroui/react';
import { ReactNode } from 'react';

export interface FrankInputProps {
  label?: ReactNode;
  type?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  isRequired?: boolean;
  errorMessage?: ReactNode;
  name?: string;
  labelPlacement?: 'outside' | 'outside-left' | 'inside';
  variant?: 'flat' | 'faded' | 'bordered' | 'underlined';
  radius?: 'sm' | 'md' | 'lg' | 'none' | 'full';
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
    />
  );
};
