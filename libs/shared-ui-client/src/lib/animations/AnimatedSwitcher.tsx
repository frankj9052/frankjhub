import { useState, useEffect, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type AnimatedSwitcherProps = {
  children: ReactNode[];
  interval?: number;
  className?: string;
};
/**
 * AnimatedSwitcher or text loop 组件用于在多个子节点之间自动循环切换显示，
 * 并带有平滑的进出场动画。适用于文本或轻量组件的轮播场景。
 *
 * @param {ReactNode[]} children - 要循环展示的子组件数组。
 * @param {number} [interval=3000] - 每个子组件显示的时间间隔（毫秒）。
 * @param {string} [className] - 可选的自定义样式类名，作用于容器元素。
 *
 * @returns {JSX.Element} 自动轮播切换子元素的动画组件。
 *
 * @example
 * ```tsx
 * <AnimatedSwitcher interval={2000}>
 *   <div>First Message</div>
 *   <div>Second Message</div>
 *   <div>Third Message</div>
 * </AnimatedSwitcher>
 * ```
 */
export const AnimatedSwitcher = ({
  children,
  interval = 3000,
  className,
}: AnimatedSwitcherProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % children.length);
    }, interval);
    return () => clearInterval(timer);
  }, [children.length, interval]);

  const variants = {
    enter: {
      y: 20,
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: -20,
      opacity: 0,
    },
  };

  return (
    <div style={{ position: 'relative' }} className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={variants}
          style={{ position: 'absolute', whiteSpace: 'nowrap' }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
        >
          {children[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
