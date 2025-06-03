import { MotionValue, useScroll, useTransform, motion } from 'framer-motion';
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import Lenis from 'lenis';
import Image from 'next/image';
import { ImageType } from '@frankjhub/shared-utils';

type ScalableChildProps = {
  imageScale?: MotionValue<number>;
  [key: string]: any; // 为了不限制其它 props
};

type CardProps = {
  index: number;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
  children: ReactNode;
  isScaled?: boolean;
  gap?: number;
  startPoint?: number;
  cardHeader?: ReactNode;
  backgroundImage?: ImageType;
};

const Card = ({
  index,
  progress,
  range,
  targetScale,
  children,
  isScaled,
  gap = 25,
  startPoint = 5,
  cardHeader,
  backgroundImage,
}: CardProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  // 克隆 children 注入 imageScale 属性
  const enhancedChildren = isValidElement(children)
    ? cloneElement(children as ReactElement<ScalableChildProps>, { imageScale })
    : children;
  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
      {index === 0 && backgroundImage && (
        <Image
          width={backgroundImage?.width}
          height={backgroundImage?.height}
          alt={backgroundImage?.alt || 'bg'}
          src={backgroundImage?.src || ''}
          className="absolute w-full h-full object-cover"
        />
      )}
      {/* Card */}
      <motion.div
        style={{
          ...(isScaled && { scale }),
          top: `calc(-${startPoint}vh + ${index * gap}px)`,
        }}
        className="flex flex-col relative origin-top"
      >
        {index === 0 && cardHeader && cardHeader}
        {/* body */}
        {enhancedChildren}
      </motion.div>
    </div>
  );
};

export type CardParallaxProps = {
  children: ReactNode;
  cardHeader?: ReactNode;
  isScaled?: boolean;
  gap?: number;
  startPoint?: number;
  backgroundImage?: ImageType;
  wheelSpeed?: number;
};
/**
 * A component that creates a parallax effect by scaling and positioning
 * its children based on the scroll position.
 * Require: framer-motion, lenis
 *
 * @param children The children to render inside the parallax. include imageScale:MotionValue<number> in props if it include img and need scale requirement.
 * @param cardHeader The header of the parallax.
 * @param isScaled Whether the children should be scaled.
 * @param gap The gap between each child.
 * @param startPoint The starting point of the parallax effect, in screen view.
 * @param backgroundImage The background image of the parallax effect.
 * @returns A JSX element that renders the parallax effect.
 */

export function CardParallax({
  children,
  cardHeader,
  isScaled,
  gap,
  startPoint,
  backgroundImage,
  wheelSpeed = 1.2,
}: CardParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: wheelSpeed, // default 1.2
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // default easing function
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, [wheelSpeed]);

  return (
    <div ref={container} className="relative">
      {Children.map(children, (child, index) => {
        const targetScale = 1 - (Children.count(children) - index) * 0.05;
        return (
          <Card
            key={`p_${index}`}
            index={index}
            progress={scrollYProgress}
            range={[index * 0.25, 1]}
            targetScale={targetScale}
            children={child}
            isScaled={isScaled}
            gap={gap}
            startPoint={startPoint}
            cardHeader={cardHeader}
            backgroundImage={backgroundImage}
          />
        );
      })}
    </div>
  );
}

export default CardParallax;
