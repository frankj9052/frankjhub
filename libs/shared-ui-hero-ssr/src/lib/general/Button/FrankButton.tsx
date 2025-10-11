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
  FullWidth,
  AriaLabel,
  DisableAnimation,
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
  fullWidth?: FullWidth;
  ariaLabel?: AriaLabel;
  disableAnimation?: DisableAnimation;
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
      fullWidth,
      ariaLabel,
      disableAnimation,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        {...props}
        aria-label={ariaLabel}
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
        fullWidth={fullWidth}
        disableAnimation={disableAnimation}
      >
        {children}
      </Button>
    );
  }
);
