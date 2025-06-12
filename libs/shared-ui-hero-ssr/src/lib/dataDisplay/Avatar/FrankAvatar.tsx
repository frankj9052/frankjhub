import { Avatar, AvatarProps } from '@heroui/react';
import { forwardRef } from 'react';

export type FrankAvatarProps = {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  isBordered?: boolean;
  radius?: 'sm' | 'md' | 'lg' | 'none' | 'full';
  className?: string;
} & AvatarProps;

/**
 * A customized Avatar component based on @heroui/react Avatar,
 * allowing additional styling and configuration.
 *
 * @param {string} [name] - Optional. The user's name used for displaying initials if no image is provided.
 * @param {string} [src] - Optional. The URL of the avatar image.
 * @param {"sm" | "md" | "lg"} [size] - Optional. Size of the avatar: small, medium, or large.
 * @param {boolean} [isDisabled] - Optional. Whether to disable avatar interactions like click or hover.
 * @param {boolean} [isBordered] - Optional. Whether to show a border around the avatar.
 * @param {"sm" | "md" | "lg" | "none" | "full"} [radius] - Optional. Border radius of the avatar (including full circle).
 * @param {string} [className] - Optional. Custom class name for additional CSS styling.
 * @param {AvatarProps} props - All other props inherited from the original Avatar component.
 */
export const FrankAvatar = forwardRef<HTMLDivElement, FrankAvatarProps>(
  ({ name, src, size, isDisabled, isBordered, radius, className, ...props }, ref) => {
    return (
      <Avatar
        src={src}
        name={name}
        size={size}
        isDisabled={isDisabled}
        isBordered={isBordered}
        radius={radius}
        className={className}
        ref={ref}
        {...props}
      />
    );
  }
);

FrankAvatar.displayName = 'FrankAvatar';
export default FrankAvatar;
