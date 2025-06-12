import { ReactNode } from 'react';
import clsx from 'clsx';
import { useControlledState } from '@frankjhub/shared-hooks';

export type FrankPopoverGeneralType = {
  isOpen?: boolean;
  popoverTrigger: ReactNode;
  popoverContent: ReactNode;
  zIndex?: number;
};

/**
 * A simple general-purpose popover component that toggles visibility
 * by clicking on the trigger element, without using a UI library.
 *
 * @param {boolean} [isOpen] - Optional. Controlled open state of the popover.
 * @param {ReactNode} popoverTrigger - The element that triggers the popover on click.
 * @param {ReactNode} popoverContent - The content displayed inside the popover.
 * @param {number} [zIndex=10] - Optional. z-index value for the popover layering.
 */
export function FrankPopoverGeneral({
  isOpen,
  popoverTrigger,
  popoverContent,
  zIndex,
}: FrankPopoverGeneralType) {
  const [isOpenState, setIsOpenState] = useControlledState(isOpen, false);
  return (
    <div className="relative">
      {/* trigger */}
      <div
        onClick={() => {
          setIsOpenState?.(prev => !prev);
        }}
      >
        {popoverTrigger}
      </div>
      {/* popover */}
      <div
        className={clsx(`z-${zIndex ?? 10}`, {
          hidden: !isOpenState,
          absolute: isOpenState,
        })}
      >
        {popoverContent}
      </div>
    </div>
  );
}

export default FrankPopoverGeneral;
