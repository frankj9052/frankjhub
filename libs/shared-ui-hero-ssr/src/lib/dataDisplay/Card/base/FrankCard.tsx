import { Card } from '@heroui/react';
import {
  AllowTextSelectionOnPress,
  CardRadius,
  Children,
  ClassName,
  DisableAnimation,
  DisableRipple,
  FullWidth,
  IsBlurred,
  IsDisabled,
  IsFooterBlurred,
  IsHoverable,
  IsPressable,
  OnPress,
  Shadow,
} from '../../../../types/props.types';

export interface FrankCardProps {
  children?: Children;
  className?: ClassName;
  isBlurred?: IsBlurred;
  isFooterBlurred?: IsFooterBlurred;
  isPressable?: IsPressable;
  shadow?: Shadow;
  onPress?: OnPress;
  fullWidth?: FullWidth;
  isHoverable?: IsHoverable;
  isDisabled?: IsDisabled;
  disableAnimation?: DisableAnimation;
  disableRipple?: DisableRipple;
  allowTextSelectionOnPress?: AllowTextSelectionOnPress;
  radius?: CardRadius;
}

export const FrankCard = ({
  children,
  className,
  isBlurred,
  isFooterBlurred,
  isPressable,
  shadow,
  onPress,
  fullWidth,
  isHoverable,
  isDisabled,
  disableAnimation,
  disableRipple,
  allowTextSelectionOnPress,
  radius,
}: FrankCardProps) => {
  return (
    <Card
      className={className}
      isBlurred={isBlurred}
      isFooterBlurred={isFooterBlurred}
      isPressable={isPressable}
      shadow={shadow}
      onPress={onPress}
      fullWidth={fullWidth}
      isHoverable={isHoverable}
      isDisabled={isDisabled}
      disableAnimation={disableAnimation}
      disableRipple={disableRipple}
      allowTextSelectionOnPress={allowTextSelectionOnPress}
      radius={radius}
    >
      {children}
    </Card>
  );
};
