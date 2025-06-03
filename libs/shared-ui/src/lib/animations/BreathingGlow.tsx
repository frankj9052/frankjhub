import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export type BreathingGlowProps = {
  children: ReactNode;
  duration?: number;
};

/**
 * A React component that applies a smooth breathing glow effect
 * to its child elements using Framer Motion animations.
 *
 * @param {ReactNode} children - The content to apply the breathing glow effect to.
 * @param {number} [duration=2] - Optional. Duration of one full breathing cycle in seconds. Defaults to 2.
 */
export function BreathingGlow({ children, duration = 2 }: BreathingGlowProps) {
  return (
    <motion.div
      className=""
      animate={{
        opacity: [1, 0.7, 1],
        scale: [1, 0.7, 1],
      }}
      transition={{
        duration: duration,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      }}
    >
      {children}
    </motion.div>
  );
}

export default BreathingGlow;
