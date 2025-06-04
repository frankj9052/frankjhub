import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDraggable,
} from '@heroui/react';
import { ReactNode, RefObject, useRef } from 'react';
import { FrankButtonBase, FrankButtonBaseProps } from '../../general/Button/FrankButtonBase';

export type FrankModalProps = {
  isOpen: boolean;
  onClose: () => void;
  header?: ReactNode;
  body: ReactNode;
  footerButtons?: FrankButtonBaseProps[];
  imageModal?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  placement?: 'center' | 'top-center' | 'auto' | 'top' | 'bottom' | 'bottom-center';
  backdrop?: 'transparent' | 'opaque' | 'blur';
  draggable?: boolean;
  hideCloseButton?: boolean;
  hideHeaderAndFooter?: boolean;
  zIndex?: number;
};

/**
 * A highly customizable modal component based on @heroui/react Modal,
 * supporting draggable behavior, optional header/footer visibility, and custom buttons.
 *
 * @param {boolean} isOpen - Whether the modal is currently open.
 * @param {() => void} onClose - Callback triggered when the modal is requested to close.
 * @param {ReactNode} [header] - Optional. Content to display in the modal header.
 * @param {ReactNode} body - Content to display in the modal body.
 * @param {FrankButtonBaseProps[]} [footerButtons] - Optional. Array of button configurations for the modal footer.
 * @param {boolean} [imageModal] - Optional. If true, renders a minimal modal for displaying images.
 * @param {"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full"} [size] - Optional. Size of the modal.
 * @param {"center" | "top-center" | "auto" | "top" | "bottom" | "bottom-center"} [placement="top-center"] - Optional. Placement of the modal on screen.
 * @param {"transparent" | "opaque" | "blur"} [backdrop="transparent"] - Optional. Type of backdrop behind the modal.
 * @param {boolean} [draggable=false] - Optional. Whether the modal can be dragged.
 * @param {boolean} [hideCloseButton=false] - Optional. Whether to hide the close button.
 * @param {boolean} [hideHeaderAndFooter=false] - Optional. Whether to hide both the header and footer sections.
 * @param {number} [zIndex=50] - Optional. z-index value for the modal to control layering.
 */
// image modal is just show the original photo
export function FrankModal({
  isOpen,
  onClose,
  header,
  body,
  footerButtons,
  imageModal,
  size,
  placement = 'top-center',
  backdrop = 'transparent',
  draggable = false,
  hideCloseButton = false,
  hideHeaderAndFooter = false,
  zIndex = 50,
}: FrankModalProps) {
  // original close event has been covered by something else, we manually add one
  const handleClose = () => {
    setTimeout(() => onClose(), 10);
  };
  const targetRef = useRef<HTMLElement>(null) as RefObject<HTMLElement>;
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  return (
    <Modal
      {...(draggable && { ref: targetRef })}
      isOpen={isOpen}
      onClose={handleClose}
      placement={placement}
      classNames={{
        wrapper: `${zIndex ? `z-${zIndex}` : ''}`,
        base: `${imageModal ? 'border-2 border-white' : ''}`,
        body: `${imageModal || hideHeaderAndFooter ? 'p-0' : ''}`,
        header: `${hideHeaderAndFooter ? '!hidden' : ''}`,
        footer: `${hideHeaderAndFooter ? 'hidden' : ''}`,
      }}
      // animation
      motionProps={{
        variants: {
          enter: { y: 0, opacity: 100, transition: { duration: 0.3 } },
          exit: { y: 100, opacity: 0, transition: { duration: 0.3 } },
        },
      }}
      size={size}
      backdrop={backdrop}
      hideCloseButton={hideCloseButton || hideHeaderAndFooter}
    >
      <ModalContent>
        {
          // show header if not image modal
          !imageModal && (
            <ModalHeader className="flex flex-col gap-1" {...moveProps}>
              {header}
            </ModalHeader>
          )
        }
        <ModalBody>{body}</ModalBody>
        {
          // show footer if not image modal
          !imageModal && (
            <ModalFooter>
              {footerButtons &&
                footerButtons.map((props: FrankButtonBaseProps, index) => (
                  <FrankButtonBase {...props} key={index} />
                ))}
            </ModalFooter>
          )
        }
      </ModalContent>
    </Modal>
  );
}

export default FrankModal;
