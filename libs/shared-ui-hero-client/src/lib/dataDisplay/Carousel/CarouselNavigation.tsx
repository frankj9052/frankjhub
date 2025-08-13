import clsx from 'clsx';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
export interface CarouselNavigationProps {
  direction: 'left' | 'right';
  disabled?: boolean;
  onClick?: () => void;
}

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
