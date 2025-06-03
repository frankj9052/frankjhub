import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { ReactNode } from 'react';
import { useControlledState } from '../../../useHooks';

export type FrankPopoverProps = {
  placement:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end';
  popoverTrigger: ReactNode;
  popoverContent: ReactNode;
  showArrow?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  radius?: 'sm' | 'md' | 'lg' | 'none' | 'full';
  isOpen?: boolean;
  onOpenChange?: (open: boolean | undefined) => void;
};

/**
 * A customizable popover component based on @heroui/react,
 * supporting controlled or uncontrolled open state, placement, and styling options.
 *
 * @param {"top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end" | "right-start" | "right-end"} placement - Placement of the popover relative to the trigger element.
 * @param {ReactNode} popoverTrigger - The element that triggers the popover when clicked or hovered.
 * @param {ReactNode} popoverContent - The content displayed inside the popover.
 * @param {boolean} [showArrow] - Optional. Whether to display an arrow pointing to the trigger element.
 * @param {"sm" | "md" | "lg" | "none"} [shadow="md"] - Optional. Size of the shadow around the popover.
 * @param {"sm" | "md" | "lg" | "none" | "full"} [radius="md"] - Optional. Border radius of the popover.
 * @param {boolean} [isOpen] - Optional. Controlled open state of the popover.
 * @param {(open: boolean | undefined) => void} [onOpenChange] - Optional. Callback triggered when the popover's open state changes.
 */
export function FrankPopover({
  placement,
  popoverTrigger,
  popoverContent,
  showArrow,
  shadow = 'md',
  radius = 'md',
  isOpen,
  onOpenChange,
}: FrankPopoverProps) {
  const [isOpenState, setIsOpenState] = useControlledState(isOpen, false);
  return (
    <Popover
      placement={placement}
      showArrow={showArrow}
      shadow={shadow}
      radius={radius}
      classNames={{
        content: 'p-0',
      }}
      isOpen={isOpenState}
      onOpenChange={open => {
        setIsOpenState?.(open);
        onOpenChange?.(open);
      }}
    >
      <PopoverTrigger>{popoverTrigger}</PopoverTrigger>
      <PopoverContent>{popoverContent}</PopoverContent>
    </Popover>
  );
}

export default FrankPopover;
