import {
  AriaLabel,
  Children,
  ClassName,
  ClassNamesForSwitch,
  ColorForSwitch,
  DefaultSelected,
  EndContent,
  IsDisabled,
  IsSelected,
  OnValueChangeForSwitch,
  Size,
  StartContent,
  ThumbIcon,
} from '@frankjhub/shared-ui-hero-ssr';
import { Switch } from '@heroui/react';

export interface FrankSwitchProps {
  ariaLabel?: AriaLabel;
  defaultSelected?: DefaultSelected;
  children?: Children;
  isDisabled?: IsDisabled;
  size?: Size;
  color?: ColorForSwitch;
  thumbIcon?: ThumbIcon;
  startContent?: StartContent;
  endContent?: EndContent;
  className?: ClassName;
  classNames?: ClassNamesForSwitch;
  isSelected?: IsSelected;
  onValueChange?: OnValueChangeForSwitch;
}

export const FrankSwitch = ({
  ariaLabel,
  defaultSelected,
  children,
  isDisabled,
  size,
  color,
  thumbIcon,
  startContent,
  endContent,
  className,
  classNames,
  isSelected,
  onValueChange,
}: FrankSwitchProps) => {
  return (
    <Switch
      aria-label={ariaLabel}
      defaultSelected={defaultSelected}
      isDisabled={isDisabled}
      size={size}
      color={color}
      thumbIcon={thumbIcon}
      startContent={startContent}
      endContent={endContent}
      className={className}
      classNames={classNames}
      isSelected={isSelected}
      onValueChange={onValueChange}
    >
      {children}
    </Switch>
  );
};
