import clsx from 'clsx';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';

export type FrankArrowSwitcherProps = {
  leftArrowDisabled?: boolean;
  rightArrowDisabled?: boolean;
  handleLeftArrowClick?: () => void;
  handleRightArrowClick?: () => void;
};

/**
 * A component that renders two arrow buttons (left and right) with some default styles.
 * The component is fully controllable, meaning you can pass in the desired state and
 * functions to control the component's behavior.
 *
 * @param {FrankArrowSwitcherProps} props
 * @prop {boolean} [leftArrowDisabled=false] Whether the left arrow button is disabled.
 * @prop {boolean} [rightArrowDisabled=false] Whether the right arrow button is disabled.
 * @prop {() => void} [handleLeftArrowClick] The function to be called when the left arrow button is clicked.
 * @prop {() => void} [handleRightArrowClick] The function to be called when the right arrow button is clicked.
 */
export function FrankArrowSwitcher({
  leftArrowDisabled,
  rightArrowDisabled,
  handleLeftArrowClick,
  handleRightArrowClick,
}: FrankArrowSwitcherProps) {
  return (
    <div className="flex text-[#4A4A4A]">
      {/* Left */}
      <div
        className={clsx(
          [
            'flex items-center justify-center border-[#E3E3E3] border-l-1 border-r-[1px] border-y-1 w-10 h-8 rounded-l-lg bg-white',
          ],
          {
            'bg-[#0000000D] text-[#CCCCCC]': leftArrowDisabled,
            'active:bg-[#EBEBEB] active:shadow-[inset_0px_2px_1px_0px_#00000026]':
              !leftArrowDisabled,
            'focus:border-white focus:shadow-[0px_0px_0px_2px-#0062D3] focus:bg-[#00000000]':
              !leftArrowDisabled,
            'hover:bg-[#FAFAFA] hover:border-[#CCC]': !leftArrowDisabled,
            'cursor-pointer': !leftArrowDisabled,
            'cursor-not-allowed': leftArrowDisabled,
          }
        )}
        onClick={handleLeftArrowClick}
      >
        <GoChevronLeft />
      </div>
      {/* Divider */}
      <div />
      {/* Right */}
      <div
        className={clsx(
          [
            'flex items-center justify-center border-[#E3E3E3] border-r-1 border-l-[1px] border-y-1 w-10 h-8 rounded-r-lg bg-white -ml-px',
          ],
          {
            'bg-[#0000000D] text-[#CCCCCC]': rightArrowDisabled,
            'active:bg-[#EBEBEB] active:shadow-[inset_0px_2px_1px_0px_#00000026]':
              !rightArrowDisabled,
            'focus:border-white focus:shadow-[0px_0px_0px_2px-#0062D3] focus:bg-[#00000000]':
              !rightArrowDisabled,
            'hover:bg-[#FAFAFA] hover:border-[#CCC]': !rightArrowDisabled,
            'cursor-pointer': !rightArrowDisabled,
            'cursor-not-allowed': rightArrowDisabled,
          }
        )}
        onClick={handleRightArrowClick}
      >
        <GoChevronRight />
      </div>
    </div>
  );
}

export default FrankArrowSwitcher;
