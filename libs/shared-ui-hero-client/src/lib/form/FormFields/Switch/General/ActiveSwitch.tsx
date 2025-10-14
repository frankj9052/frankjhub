import { ColorForSwitch, IsSelected, OnValueChangeForSwitch } from '@frankjhub/shared-ui-hero-ssr';
import { FrankSwitch } from '../Base';

export interface ActiveSwitchProps {
  isSelected?: IsSelected;
  onValueChange?: OnValueChangeForSwitch;
  color?: ColorForSwitch;
}

export const ActiveSwitch = ({ isSelected, onValueChange, color }: ActiveSwitchProps) => {
  return (
    <FrankSwitch size="sm" isSelected={isSelected} onValueChange={onValueChange} color={color}>
      <span className="font-semibold">Active</span>
    </FrankSwitch>
  );
};
