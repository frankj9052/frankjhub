import { Spinner } from '@heroui/react';

export type FrankSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  color?:
    | 'current'
    | 'white'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  label?: string;
  labelColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'foreground';
  variant?: 'default' | 'gradient' | 'wave' | 'dots' | 'spinner' | 'simple';
  className?: string;
};

/**
 * A wrapper around @heroui/react Spinner,
 * providing additional customization for size, color, label, and animation style.
 *
 * @param {"sm" | "md" | "lg"} [size] - Optional. Size of the spinner.
 * @param {"current" | "white" | "default" | "primary" | "secondary" | "success" | "warning" | "danger"} [color="current"] - Optional. Color of the spinner.
 * @param {string} [label] - Optional. Label text displayed next to or below the spinner.
 * @param {"primary" | "secondary" | "success" | "warning" | "danger" | "foreground"} [labelColor] - Optional. Color of the label text.
 * @param {"default" | "gradient" | "wave" | "dots" | "spinner" | "simple"} [variant="default"] - Optional. Animation style of the spinner.
 * @param {string} [className] - Optional. Additional CSS classes for styling the spinner.
 */
export function FrankSpinner({
  size,
  color = 'current',
  label,
  labelColor,
  variant = 'default',
  className,
}: FrankSpinnerProps) {
  return (
    <Spinner
      size={size}
      color={color}
      label={label}
      labelColor={labelColor}
      variant={variant}
      className={`${className}`}
    />
  );
}

export default FrankSpinner;
