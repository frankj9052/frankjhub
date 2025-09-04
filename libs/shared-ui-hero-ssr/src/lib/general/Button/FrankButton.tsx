import { Button } from '@heroui/react';
import { forwardRef } from 'react';
import {
  ButtonType,
  ButtonVariant,
  Children,
  ButtonColor,
  DisableRipple,
  IsLoading,
  Radius,
  Size,
} from '../../../types/props.types';

export interface FrankButtonProps {
  children?: Children;
  onPress?: () => void;
  variant?: ButtonVariant;
  radius?: Radius;
  disableRipple?: DisableRipple;
  size?: Size;
  type?: ButtonType;
  isLoading?: IsLoading;
  color?: ButtonColor;
}

export const FrankButton = forwardRef<HTMLButtonElement, FrankButtonProps>(
  (
    { children, onPress, variant, radius, disableRipple, size, type, isLoading, color, ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        {...props}
        onPress={onPress}
        variant={variant}
        radius={radius}
        disableRipple={disableRipple}
        size={size}
        type={type}
        isLoading={isLoading}
        color={color}
      >
        {children}
      </Button>
    );
  }
);
