import { Textarea } from '@heroui/react';
import { FocusEvent, Key, ReactNode } from 'react';

export type FrankTextAreaProps = {
  className?: string;
  label?: ReactNode;
  labelPlacement?: 'outside' | 'outside-left' | 'inside';
  defaultValue?: string;
  ariaLabel?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  variant?: 'flat' | 'faded' | 'bordered' | 'underlined';
  isRequired?: boolean;
  isClearable?: boolean;
  onClear?: () => void;
  minRows?: number;
  maxRows?: number;
  disableAnimation?: boolean;
  disableAutosize?: boolean;
  classNames?: {
    base?: string;
    input?: string;
  };
  key?: Key;
  isInvalid?: boolean;
  errorMessage?: string;
  description?: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  size?: 'sm' | 'md' | 'lg';
  width?: number;
  radius?: 'sm' | 'md' | 'lg' | 'none' | 'full';
};

/**
 * FrankTextArea 是一个封装了 HeroUI Textarea 的多行文本输入组件。
 * 它支持受控与非受控输入、样式定制、辅助信息、错误信息提示，以及交互事件。
 *
 * @component
 * @param {Object} props - 组件的属性对象。
 * @param {string} [props.className] - 根元素的自定义类名。
 * @param {ReactNode} [props.label] - 输入框的标签内容。
 * @param {'outside' | 'outside-left' | 'inside'} [props.labelPlacement] - 标签的位置。
 * @param {string} [props.defaultValue] - 输入框的初始值（非受控模式）。
 * @param {string} [props.ariaLabel] - 无可见标签时用于无障碍的 aria-label。
 * @param {string} [props.placeholder] - 占位符文本。
 * @param {boolean} [props.isDisabled] - 是否禁用。
 * @param {boolean} [props.isReadOnly] - 是否只读。
 * @param {'flat' | 'faded' | 'bordered' | 'underlined'} [props.variant] - 视觉风格。
 * @param {boolean} [props.isRequired] - 是否为必填项。
 * @param {boolean} [props.isClearable] - 是否显示清除按钮。
 * @param {() => void} [props.onClear] - 清除按钮点击事件处理函数。
 * @param {number} [props.minRows] - 最小行数。
 * @param {number} [props.maxRows] - 最大行数。
 * @param {boolean} [props.disableAnimation] - 是否禁用动画。
 * @param {boolean} [props.disableAutosize] - 是否禁用自动行高调整。
 * @param {Object} [props.classNames] - 用于自定义样式的类名对象。
 * @param {string} [props.classNames.base] - 根元素类名。
 * @param {string} [props.classNames.input] - 输入区域类名。
 * @param {Key} [props.key] - 组件的唯一 key。
 * @param {boolean} [props.isInvalid] - 是否处于错误状态。
 * @param {string} [props.errorMessage] - 错误提示信息。
 * @param {ReactNode} [props.description] - 描述信息。
 * @param {string} [props.value] - 输入框的值（受控模式）。
 * @param {(value: string) => void} [props.onValueChange] - 文本值变更事件。
 * @param {(e: FocusEvent<HTMLTextAreaElement>) => void} [props.onBlur] - 失焦事件处理函数。
 * @param {'sm' | 'md' | 'lg'} [props.size] - 尺寸大小。
 * @param {number} [props.width] - 宽度（单位为 px）。
 * @param {'sm' | 'md' | 'lg' | 'none' | 'full'} [props.radius] - 边角圆角大小。
 *
 * @returns {JSX.Element} 封装后的 Textarea JSX 元素。
 */
export const FrankTextArea = ({
  className,
  label,
  labelPlacement,
  defaultValue,
  ariaLabel,
  placeholder,
  isDisabled,
  isReadOnly,
  variant,
  isRequired,
  isClearable,
  onClear,
  minRows,
  maxRows,
  disableAnimation,
  disableAutosize,
  classNames,
  key,
  isInvalid,
  errorMessage,
  description,
  value,
  onValueChange,
  onBlur,
  size,
  width,
  radius,
}: FrankTextAreaProps) => {
  return (
    <div
      style={{
        width: width ? `${width}px` : '100%',
      }}
    >
      <Textarea
        isReadOnly={!!isReadOnly}
        className={className}
        label={label}
        labelPlacement={labelPlacement}
        defaultValue={defaultValue}
        aria-label={ariaLabel}
        placeholder={placeholder}
        isDisabled={!!isDisabled}
        variant={variant}
        isRequired={!!isRequired}
        isClearable={!!isClearable}
        onClear={() => {
          if (onClear) {
            onClear();
          }
        }}
        minRows={minRows}
        maxRows={maxRows}
        disableAnimation={!!disableAnimation}
        disableAutosize={!!disableAutosize}
        classNames={classNames}
        key={key}
        isInvalid={!!isInvalid}
        errorMessage={errorMessage}
        description={description}
        value={value}
        onValueChange={onValueChange}
        onBlur={onBlur}
        size={size}
        radius={radius}
      />
    </div>
  );
};
