import {
  Avatar,
  Children,
  ClassName,
  ClassNamesForChip,
  ColorForChip,
  EndContent,
  IsDisabled,
  OnClose,
  Radius,
  Size,
  StartContent,
  VariantForChip,
} from '@frankjhub/shared-ui-hero-ssr';
import { Chip } from '@heroui/react';

export interface FrankChipProps {
  variant?: VariantForChip;
  children?: Children;
  isDisabled?: IsDisabled;
  size?: Size;
  color?: ColorForChip;
  radius?: Radius;
  startContent?: StartContent;
  endContent?: EndContent;
  onClose?: OnClose;
  avatar?: Avatar;
  className?: ClassName;
  classNames?: ClassNamesForChip;
}

export const FrankChip = ({
  variant,
  children,
  isDisabled,
  size,
  color,
  radius,
  startContent,
  endContent,
  onClose,
  avatar,
  className,
  classNames,
}: FrankChipProps) => {
  return (
    <Chip
      variant={variant}
      isDisabled={isDisabled}
      size={size}
      color={color}
      radius={radius}
      startContent={startContent}
      endContent={endContent}
      onClose={onClose}
      avatar={avatar}
      className={className}
      classNames={classNames}
    >
      {children}
    </Chip>
  );
};
