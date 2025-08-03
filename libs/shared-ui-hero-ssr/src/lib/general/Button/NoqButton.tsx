import { forwardRef } from 'react';
import clsx from 'clsx';
import { FrankSpinner } from '../../feedback';

export type NoqButtonProps = {
  theme: 'Default' | 'Brand' | 'Ghost';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  text?: string;
  textStyle?: string;
  handleClick?: () => void;
  height?: number;
  width?: number;
};

/**
 * A customizable button component with theming, loading state, and optional icons,
 * designed for consistent styling across different usage scenarios.
 *
 * @param {'Default' | 'Brand' | 'Ghost'} theme - Visual theme of the button.
 * @param {'sm' | 'md' | 'lg'} [size] - Optional. Predefined size of the button (small, medium, large).
 * @param {boolean} [isDisabled] - Optional. Whether the button is disabled.
 * @param {boolean} [loading] - Optional. Whether the button shows a loading spinner.
 * @param {React.ReactNode} [icon] - Optional. Icon to display inside the button.
 * @param {string} [text] - Optional. Text label inside the button.
 * @param {string} [textStyle] - Optional. Additional className(s) for styling the text.
 * @param {() => void} [handleClick] - Optional. Callback triggered when the button is clicked.
 * @param {number} [height] - Optional. Custom height of the button in pixels (if size is not set).
 * @param {number} [width] - Optional. Custom width of the button in pixels (if size is not set).
 */
export const NoqButton = forwardRef<HTMLButtonElement, NoqButtonProps>(
  (
    {
      theme,
      size,
      height,
      width,
      isDisabled,
      loading,
      icon,
      text,
      textStyle,
      handleClick,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        {...props}
        className={clsx(
          'transition duration-200 ease-in-out font-inter min-w-0 w-full rounded-[8px] overflow-hidden text-ellipsis flex items-center justify-center active:shadow-[inset_0px_2px_1px_0px_rgba(0,0,0,0.15)] focus:outline-offset-2 focus:outline-[#0062D3] transition-none disabled:pointer-events-none select-none',
          {
            'bg-[#fff] border-1 text-[#303030] hover:bg-[#ccc] active:bg-[#EBEBEB] disabled:bg-[#F2F2F2] disabled:text-[#B5B5B5] disabled:border-none':
              theme === 'Default',
            'bg-[#0C534F] hover:bg-[#0C6A64] focus:bg-[#0C6A64] active:bg-[#003F3C] focus:text-[#E4FFE5] active:text-[#D0FFD1] text-[#E4FFE5] disabled:bg-[#C1C1BD] disabled:text-[#E3E3DE]':
              theme === 'Brand',
            'focus:bg-[#0000000D] hover:bg-[#0000000D] active:bg-[#00000014] text-[#303030] disabled:text-[#B5B5B5]':
              theme === 'Ghost',
            'px-1': !text,
          },
          {
            'px-[8px] py-[4px] aw-[66px] h-[24px] text-[12px] ': size === 'sm',
            'px-[8px] py-[6px] aw-[76px] h-[33px]  text-[13px]': size === 'md',
            'px-[8px] py-[8px] aw-[82px] h-[36px]  text-[14px]': size === 'lg',
            'w-full': !size && !width,
          }
        )}
        disabled={isDisabled || loading}
        color="default"
        onClick={handleClick}
        style={{
          height: height && !size ? `${height}px` : '100%',
          width: width && !size ? `${width}px` : '100%',
        }}
      >
        {loading ? (
          <FrankSpinner variant="simple" size="sm" />
        ) : (
          <div
            className={clsx(`flex items-center w-full`, {
              'justify-center gap-0': !text,
              'gap-1': !!text,
            })}
          >
            {icon && (
              <span
                className={clsx({ 'grayscale opacity-90 flex': isDisabled && theme === 'Brand' })}
              >
                {icon}
              </span>
            )}
            <span className={`${textStyle ?? ''}`}>{text}</span>
          </div>
        )}
      </button>
    );
  }
);
NoqButton.displayName = 'NoqButton';
export default NoqButton;
