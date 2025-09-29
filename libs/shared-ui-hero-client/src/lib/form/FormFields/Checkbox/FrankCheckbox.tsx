import { Checkbox, Spacer } from '@heroui/react';
import { CSSProperties, ReactNode } from 'react';

export type FrankCheckboxProps = {
  insideContent?: ReactNode;
  outsideContent?: ReactNode;
  value: string;
  isDisabled?: boolean;
  defaultSelected?: boolean;
  color?: string;
  checkboxHeight?: number;
  gap?:
    | 0
    | 1
    | 'px'
    | 0.5
    | 1.5
    | 2
    | 2.5
    | 3
    | 3.5
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 14
    | 16
    | 20
    | 24
    | 28
    | 32
    | 36
    | 40
    | 44
    | 48
    | 52
    | 56
    | 60
    | 64
    | 72
    | 80
    | 96;
};

/**
 * A customizable checkbox component with optional inside and outside content,
 * supporting adjustable colors, sizes, and spacing.
 *
 * @param {ReactNode} [insideContent] - Optional. Content displayed inside the checkbox label.
 * @param {ReactNode} [outsideContent] - Optional. Content displayed outside (next to) the checkbox.
 * @param {string} value - Value associated with the checkbox input.
 * @param {boolean} [isDisabled] - Optional. Whether the checkbox is disabled.
 * @param {boolean} [defaultSelected] - Optional. Whether the checkbox is initially selected.
 * @param {string} [color="#003f3c"] - Optional. Custom color for the selected state background.
 * @param {number} [checkboxHeight] - Optional. Height of the checkbox container in pixels.
 * @param {0 | 1 | "px" | 0.5 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64 | 72 | 80 | 96} [gap] - Optional. Spacer size between the checkbox and the outside content.
 */
export function FrankCheckbox({
  insideContent,
  outsideContent,
  value,
  isDisabled,
  defaultSelected,
  color = '#003f3c',
  checkboxHeight,
  gap,
}: FrankCheckboxProps) {
  return (
    <div className="flex">
      <div
        className="flex items-center"
        style={{
          ...(checkboxHeight && { height: `${checkboxHeight}px` }),
        }}
      >
        <Checkbox
          value={value}
          isDisabled={!!isDisabled}
          defaultSelected={!!defaultSelected}
          style={
            {
              '--after-bg-color': color,
            } as CSSProperties
          }
          classNames={{
            wrapper:
              'border-red-300 before:border-color-bg-fill-fill-brand after:bg-[var(--after-bg-color)]',
            label: 'text-[13px] text-color-text-text font-inter leading-5',
          }}
          radius="sm"
          size="sm"
        >
          {insideContent && insideContent}
        </Checkbox>
      </div>
      {gap && outsideContent && <Spacer x={gap} />}
      {outsideContent && outsideContent}
    </div>
  );
}

export default FrankCheckbox;
