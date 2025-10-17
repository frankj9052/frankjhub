import { Link } from '@heroui/react';
import {
  AnchorIcon,
  Children,
  ClassName,
  ColorForLink,
  Href,
  IsBlock,
  IsDisabled,
  IsExternal,
  ShowAnchorIcon,
  Size,
  Underline,
} from '../../../../types';
export interface FrankLinkProps {
  children?: Children;
  href?: Href;
  isDisabled?: IsDisabled;
  size?: Size;
  color?: ColorForLink;
  underline?: Underline;
  /** 链接会自动带上 target="_blank" 和 rel="noopener noreferrer" 属性 */
  isExternal?: IsExternal;
  /** 链接是否带箭头图标 */
  showAnchorIcon?: ShowAnchorIcon;
  /** 自定义箭头图标 */
  anchorIcon?: AnchorIcon;
  /** hover后是否有框 */
  isBlock?: IsBlock;
  className?: ClassName;
}
export const FrankLink = ({
  children,
  href,
  isDisabled,
  size,
  color,
  underline,
  isExternal,
  showAnchorIcon,
  anchorIcon,
  isBlock,
  className,
}: FrankLinkProps) => {
  return (
    <Link
      href={href}
      isDisabled={isDisabled}
      size={size}
      color={color}
      underline={underline}
      isExternal={isExternal}
      showAnchorIcon={showAnchorIcon}
      anchorIcon={anchorIcon}
      isBlock={isBlock}
      className={className}
    >
      {children}
    </Link>
  );
};
