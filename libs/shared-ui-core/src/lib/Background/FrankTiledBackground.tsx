import { ReactNode } from 'react';

export type FrankTileBackgroundProps = {
  imageUrl: string;
  className?: string;
  children?: ReactNode;
};

/**
 * A background container component that tiles a given image across the entire area.
 *
 * @param {string} imageUrl - URL of the image to be used as a tiled background.
 * @param {string} [className] - Optional. Custom class name for additional styling.
 * @param {ReactNode} [children] - Optional. Child elements to render on top of the background.
 */
export function FrankTiledBackground({ imageUrl, className, children }: FrankTileBackgroundProps) {
  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
}
export default FrankTiledBackground;
