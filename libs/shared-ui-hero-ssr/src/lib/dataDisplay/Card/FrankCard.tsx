import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { ReactNode } from 'react';

export type FrankCardProps = {
  cardCover?: ReactNode;
  cardBody?: ReactNode;
  cardHeader?: ReactNode;
  cardFooter?: ReactNode;
  isBlurred?: boolean;
  isFooterBlurred?: boolean;
  isPressable?: boolean;
  isHoverable?: boolean;
  key?: number | string;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  onPress?: () => void;
  cardWidth?: number;
  cardHeight?: number;
  className?: string;
  isDisabled?: boolean;
  disableAnimation?: boolean;
  disableRipple?: boolean;
  allowTextSelectionOnPress?: boolean;
};

/**
 * FrankCard Component - A customizable card component based on HeroUI Card.
 *
 * @param {ReactNode} cardCover - The cover content of the card, typically an image or overlay.
 * @param {ReactNode} cardBody - The main body content of the card.
 * @param {ReactNode} cardHeader - The header content displayed at the top of the card.
 * @param {ReactNode} cardFooter - The footer content displayed at the bottom of the card.
 * @param {boolean} isBlurred - Whether to apply a blur effect to the card background.
 * @param {boolean} isFooterBlurred - Whether to apply a blur effect only to the card footer.
 * @param {number|string} key - Optional React key for list rendering.
 * @param {boolean} isPressable - Whether the card is pressable (clickable).
 * @param {boolean} isHoverable - Whether the card has hover interaction effects.
 * @param {'sm' | 'md' | 'lg' | 'none'} shadow - Size of the card's shadow.
 * @param {() => void} onPress - Callback function triggered when the card is pressed.
 * @param {number} cardWidth - Width of the card in pixels.
 * @param {number} cardHeight - Height of the card in pixels.
 * @param {string} className - Additional custom CSS classes for the card.
 * @param {boolean} isDisabled - Whether the card interactions are disabled.
 * @param {boolean} disableAnimation - Whether to disable card interaction animations.
 * @param {boolean} disableRipple - Whether to disable the ripple effect on click.
 * @param {boolean} allowTextSelectionOnPress - Whether to allow text selection while pressing the card.
 *
 * @returns {JSX.Element} A customizable card component with optional cover, header, body, and footer sections.
 */
export const FrankCard = ({
  cardCover,
  cardBody,
  cardHeader,
  cardFooter,
  isBlurred,
  isFooterBlurred,
  key,
  isPressable,
  isHoverable,
  shadow,
  onPress,
  cardWidth,
  cardHeight,
  className,
  isDisabled,
  disableAnimation,
  disableRipple,
  allowTextSelectionOnPress,
}: FrankCardProps) => {
  return (
    <div
      style={{
        width: cardWidth ? `${cardWidth}px` : '100%',
        height: cardHeight ? `${cardHeight}px` : '100%',
      }}
    >
      <Card
        isBlurred={isBlurred}
        isFooterBlurred={isFooterBlurred}
        key={key}
        isPressable={isPressable}
        shadow={shadow}
        onPress={onPress}
        fullWidth
        className={`${className} h-full relative`}
        isHoverable={isHoverable}
        isDisabled={isDisabled}
        disableAnimation={disableAnimation}
        disableRipple={disableRipple}
        allowTextSelectionOnPress={allowTextSelectionOnPress}
      >
        {cardCover}
        <div className="absolute w-full h-full flex flex-col">
          {cardHeader && <CardHeader>{cardHeader}</CardHeader>}
          {cardBody && <CardBody>{cardBody}</CardBody>}
          {cardFooter && <CardFooter>{cardFooter}</CardFooter>}
        </div>
      </Card>
    </div>
  );
};

export default FrankCard;
