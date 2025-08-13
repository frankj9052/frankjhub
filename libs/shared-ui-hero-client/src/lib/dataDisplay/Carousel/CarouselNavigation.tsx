import clsx from 'clsx';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
export interface CarouselNavigationProps {
  direction: 'left' | 'right';
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * CarouselNavigation - A navigation arrow component used in carousels.
 *
 * This component renders a left or right navigation arrow, typically used to scroll
 * through carousel items. It uses responsive design and only displays on medium-sized
 * screens and larger (`md:block`). Arrows are disabled visually and functionally
 * based on the `disabled` prop.
 *
 * @component
 * @example
 * ```tsx
 * <CarouselNavigation
 *   direction="left"
 *   onClick={() => handleNavigation('left')}
 *   disabled={isAtStart}
 * />
 *
 * <CarouselNavigation
 *   direction="right"
 *   onClick={() => handleNavigation('right')}
 *   disabled={isAtEnd}
 * />
 * ```
 *
 * @param {CarouselNavigationProps} props - The props for the component.
 * @param {'left' | 'right'} props.direction - Direction of the arrow to render.
 * @param {boolean} [props.disabled=false] - Whether the arrow is disabled (non-clickable and gray).
 * @param {() => void} [props.onClick] - Callback fired when the arrow is clicked.
 *
 * @returns {JSX.Element} The rendered arrow button.
 */
export const CarouselNavigation = ({
  direction,
  disabled = false,
  onClick,
}: CarouselNavigationProps) => {
  return (
    <div className="hidden md:block">
      {direction === 'left' ? (
        <div
          className={clsx('rounded-full transition duration-200', {
            'hover:bg-gray-200 active:bg-gray-100': !disabled,
          })}
        >
          <MdKeyboardArrowLeft
            size={100}
            className={clsx('', {
              'cursor-pointer text-primary active:text-gray-400': !disabled,
              'cursor-default text-gray-400': disabled,
            })}
            onClick={onClick}
          />
        </div>
      ) : (
        <div
          className={clsx('rounded-full transition duration-200', {
            'hover:bg-gray-200 active:bg-gray-100': !disabled,
          })}
        >
          <MdKeyboardArrowRight
            size={100}
            className={clsx('', {
              'cursor-pointer text-primary active:text-gray-400': !disabled,
              'cursor-default text-gray-400': disabled,
            })}
            onClick={onClick}
          />
        </div>
      )}
    </div>
  );
};
