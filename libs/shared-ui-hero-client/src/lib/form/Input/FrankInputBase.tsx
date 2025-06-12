import { Input } from '@heroui/react';
import clsx from 'clsx';
import { ReactNode } from 'react';
import styled from 'styled-components';

export type FrankInputBaseProps = {
  isRequired?: boolean;
  label?: ReactNode;
  labelPlacement?: 'outside' | 'outside-left' | 'inside';
  name?: string;
  placeholder?: string;
  type?: string;
  variant?: 'flat' | 'faded' | 'bordered' | 'underlined';
  radius?: 'sm' | 'md' | 'lg' | 'none' | 'full';
  isInvalid?: boolean;
  errorMessage?: string;
  endContent?: React.ReactNode;
  width?: number;
  height?: number;
  value?: string;
  onValueChange?: (value: string) => void;
};

const StyledInput = styled(Input)<{ width?: number; height?: number }>`
  [data-slot='input-wrapper'] {
    ${props => props.width && `width:${props.width}px`};
    ${props => props.height && `height:${props.height}px`};
  }
`;
/**
 * A styled input component based on @heroui/react Input,
 * supporting custom dimensions, validation states, and additional content.
 *
 * @param {boolean} [isRequired] - Optional. Whether the input is required.
 * @param {ReactNode} [label] - Optional. Label content for the input.
 * @param {"outside" | "outside-left" | "inside"} [labelPlacement] - Optional. Placement of the label.
 * @param {string} [name] - Optional. Name attribute for the input field.
 * @param {string} [placeholder] - Optional. Placeholder text displayed inside the input.
 * @param {string} [type] - Optional. Type attribute for the input (e.g., "text", "email", "password").
 * @param {"flat" | "faded" | "bordered" | "underlined"} [variant] - Optional. Visual style variant of the input field.
 * @param {"sm" | "md" | "lg" | "none" | "full"} [radius="sm"] - Optional. Border radius of the input.
 * @param {boolean} [isInvalid] - Optional. Whether the input is in an invalid state.
 * @param {string} [errorMessage] - Optional. Error message displayed when input is invalid.
 * @param {ReactNode} [endContent] - Optional. Content displayed at the end of the input field.
 * @param {number} [width] - Optional. Width of the input field in pixels.
 * @param {number} [height] - Optional. Height of the input field in pixels.
 * @param {string} [value] - Optional. Controlled value of the input field.
 * @param {(value: string) => void} [onValueChange] - Optional. Callback triggered when the input value changes.
 */
export function FrankInputBase({
  isRequired,
  label,
  labelPlacement,
  name,
  placeholder,
  type,
  variant,
  radius = 'sm',
  isInvalid,
  errorMessage,
  endContent,
  width,
  height,
  value,
  onValueChange,
}: FrankInputBaseProps) {
  return (
    <StyledInput
      isRequired={isRequired}
      label={label}
      labelPlacement={labelPlacement}
      name={name}
      placeholder={placeholder}
      type={type}
      variant={variant}
      classNames={{
        label: '!translate-y-[-40px]',
        inputWrapper: clsx('min-h-[0px]', {
          'border-1': variant === 'bordered' || variant === 'faded',
        }),
      }}
      radius={radius}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      endContent={endContent}
      width={width}
      height={height}
      value={value}
      onValueChange={onValueChange}
    />
  );
}

export default FrankInputBase;
