import { cloneElement, isValidElement, ReactElement, SVGProps } from 'react';

interface FrankSVGIconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
  viewBox: string;
  children: ReactElement<SVGProps<SVGSVGElement>>;
}

/**
 * A reusable SVG icon wrapper component that standardizes width, height, fill color,
 * and allows injecting child SVG paths or elements.
 *
 * @param {number} [width=24] - Optional. Width of the SVG element in pixels.
 * @param {number} [height=24] - Optional. Height of the SVG element in pixels.
 * @param {string} [fill="currentColor"] - Optional. Fill color for the SVG content.
 * @param {string} viewBox - The viewBox attribute defining the coordinate system of the SVG.
 * @param {ReactElement<SVGProps<SVGSVGElement>>} children - Child SVG elements (such as paths) to render inside the SVG.
 * @param {SVGProps<SVGSVGElement>} props - Additional standard SVG props.
 */
export function FrankSVGIcon({
  width = 24,
  height = 24,
  fill = 'currentColor',
  viewBox,
  children,
  ...props
}: FrankSVGIconProps) {
  return (
    <svg
      width={width.toString()}
      height={height.toString()}
      viewBox={viewBox}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {isValidElement(children) ? cloneElement(children, { fill: fill }) : children}
    </svg>
  );
}

export default FrankSVGIcon;
