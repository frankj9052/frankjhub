import { Progress } from '@heroui/react';

export type FrankProgressProps = {
  classNames?: Partial<
    Record<'base' | 'labelWrapper' | 'label' | 'track' | 'value' | 'indicator', string>
  >;
  className?: string;
  width?: number;
  ariaLabel?: string;
  value?: number;
  size?: 'md' | 'sm' | 'lg';
  color?: 'primary' | 'default' | 'secondary' | 'success' | 'warning' | 'danger';
  isIndeterminate?: boolean; // loading的动画效果，未知现在的未知
  isStriped?: boolean; // 虚线,
  label?: string;
  minValue?: number;
  maxValue?: number;
  isDisabled?: boolean;
};
export function FrankProgress({
  classNames,
  className,
  width,
  ariaLabel,
  value = 60,
  size,
  color,
  isIndeterminate,
  isStriped,
  label,
  minValue,
  maxValue,
  isDisabled,
}: FrankProgressProps) {
  return (
    <div
      style={{
        width: width ? `${width}px` : '100%',
      }}
    >
      <Progress
        aria-label={ariaLabel}
        value={value}
        size={size}
        color={color}
        isIndeterminate={isIndeterminate}
        isStriped={isStriped}
        label={label}
        maxValue={maxValue}
        minValue={minValue}
        isDisabled={isDisabled}
        classNames={classNames}
        className={className}
      />
    </div>
  );
}

export default FrankProgress;
