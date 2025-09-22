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
  IsIconOnly,
  IsDisabled,
  EndContent,
  ClassName,
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
  isIconOnly?: IsIconOnly;
  isDisabled?: IsDisabled;
  endContent?: EndContent;
  className?: ClassName;
}

export const FrankButton = forwardRef<HTMLButtonElement, FrankButtonProps>(
  (
    {
      children,
      onPress,
      variant,
      radius,
      disableRipple,
      size,
      type,
      isLoading,
      color,
      isIconOnly,
      isDisabled,
      endContent,
      className,
      ...props
    },
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
        isIconOnly={isIconOnly}
        isDisabled={isDisabled}
        endContent={endContent}
        className={className}
      >
        {children}
      </Button>
    );
  }
);
