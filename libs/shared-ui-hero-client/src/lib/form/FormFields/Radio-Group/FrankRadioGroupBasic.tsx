import { Radio, RadioGroup } from '@heroui/react';
import clsx from 'clsx';
import { CSSProperties, ReactNode } from 'react';

export type FrankRadioBasicDataType = {
  value: string;
  label: ReactNode;
};

export type FrankRadioGroupBasicProps = {
  defaultValue?: string;
  orientation?: 'horizontal' | 'vertical';
  isDisabled?: boolean;
  radioData: FrankRadioBasicDataType[];
  radioColor?: string;
  radioSize?: 'sm' | 'md';
  value?: string | null;
  onValueChange?: (value: string) => void;
  width?: number;
  gap?: number;
};

/**
 * A basic radio group component built on top of @heroui/react,
 * supporting customizable layout, colors, sizes, and controlled selection.
 *
 * @param {string} [defaultValue] - Optional. Default selected value.
 * @param {'horizontal' | 'vertical'} [orientation='vertical'] - Optional. Layout orientation of the radio buttons.
 * @param {boolean} [isDisabled=false] - Optional. Whether the entire radio group is disabled.
 * @param {FrankRadioBasicDataType[]} radioData - Array of radio button data (value and label).
 * @param {string} [radioColor] - Optional. Custom color for the selected radio indicator.
 * @param {'sm' | 'md'} [radioSize='sm'] - Optional. Size of the radio button.
 * @param {string | null} [value] - Optional. Controlled selected value.
 * @param {(value: string) => void} [onValueChange] - Optional. Callback triggered when the selected value changes.
 * @param {number} [width] - Optional. Width of the radio group in pixels.
 * @param {number} [gap=0] - Optional. Gap between radio buttons.
 */
export function FrankRadioGroupBasic({
  radioData,
  defaultValue,
  orientation = 'vertical',
  isDisabled = false,
  radioColor,
  radioSize = 'sm',
  value,
  onValueChange,
  width,
  gap = 0,
}: FrankRadioGroupBasicProps) {
  return (
    <RadioGroup
      value={value}
      defaultValue={defaultValue}
      orientation={orientation}
      isDisabled={isDisabled}
      {...(onValueChange && { onValueChange: onValueChange })}
      style={{
        width: width ? `${width}px` : '100%',
      }}
      classNames={{
        wrapper: `gap-${gap}`,
      }}
    >
      {radioData &&
        radioData.length > 0 &&
        radioData.map(radio => (
          <Radio
            key={radio.value}
            value={radio.value}
            style={
              {
                '--after-bg-color': radioColor,
              } as CSSProperties
            }
            classNames={{
              control: clsx('', { 'bg-[var(--after-bg-color)]': !!radioColor }),
              wrapper: clsx('border-[1px]', {
                'group-data-[selected=true]:border-[var(--after-bg-color)]': !!radioColor,
                'w-4 h-4': radioSize === 'sm',
              }),
            }}
          >
            {radio.label}
          </Radio>
        ))}
    </RadioGroup>
  );
}

export default FrankRadioGroupBasic;
