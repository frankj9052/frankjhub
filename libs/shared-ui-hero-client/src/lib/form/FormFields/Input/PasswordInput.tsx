import {
  ErrorMessage,
  IsInvalid,
  Label,
  OnBlur,
  onValueChange,
  Size,
  Value,
  Variant,
} from '@frankjhub/shared-ui-hero-ssr';
import { FrankInput } from './FrankInput';
import { useState } from 'react';
import { PiEyeLight } from 'react-icons/pi';
import { PiEyeSlash } from 'react-icons/pi';

export interface PasswordInputProps {
  label?: Label;
  variant?: Variant;
  value?: Value;
  onValueChange?: onValueChange;
  onBlur?: OnBlur;
  isInvalid?: IsInvalid;
  errorMessage?: ErrorMessage;
  size?: Size;
}

export const PasswordInput = ({
  label = 'Password',
  variant = 'bordered',
  value,
  onValueChange,
  onBlur,
  isInvalid,
  errorMessage,
  size = 'sm',
}: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(prev => !prev);
  return (
    <FrankInput
      label={label}
      variant={variant}
      value={value}
      onValueChange={onValueChange}
      onBlur={onBlur}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      size={size}
      isRequired={true}
      endContent={
        <button
          aria-label="toggle password visibility"
          type="button"
          onClick={toggleVisibility}
          className="focus:outline-solid outline-transparent"
        >
          {isVisible ? (
            <PiEyeLight className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <PiEyeSlash className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
    />
  );
};
