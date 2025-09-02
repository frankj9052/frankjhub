import {
  Children,
  ClassName,
  CloseDelay,
  Color,
  Content,
  Delay,
  Offset,
  Placement,
  ShowArrow,
} from '@frankjhub/shared-ui-hero-ssr';
import { Tooltip } from '@heroui/react';

export interface FrankTooltipProps {
  children: Children;
  content?: Content;
  showArrow?: ShowArrow;
  className?: ClassName;
  color?: Color;
  placement?: Placement;
  offset?: Offset;
  delay?: Delay;
  closeDelay?: CloseDelay;
}

export const FrankTooltip = ({
  children,
  content,
  showArrow,
  className,
  color,
  placement,
  offset,
  delay,
  closeDelay,
}: FrankTooltipProps) => {
  return (
    <Tooltip
      content={content}
      showArrow={showArrow}
      className={className}
      color={color}
      placement={placement}
      offset={offset}
      delay={delay}
      closeDelay={closeDelay}
    >
      {children}
    </Tooltip>
  );
};
