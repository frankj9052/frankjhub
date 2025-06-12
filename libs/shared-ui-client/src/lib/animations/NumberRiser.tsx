import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * A React component that animates a number rising smoothly from 1 to a target value
 * using Framer Motion's animation and viewport interaction hooks.
 *
 * @param {number} number - The target number value to animate up to.
 * @param {number} [duration=1] - Optional. Duration of the animation in seconds. Defaults to 1.
 */
export function NumberRiser({ number, duration = 1 }: { number: number; duration?: number }) {
  const count = useMotionValue(1);
  const rounded = useTransform(count, latest => Math.round(latest).toLocaleString());
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (isStarted) {
      const controls = animate(count, number, {
        duration: duration,
        onComplete: () => {
          // do something after compolete
        },
      });

      return () => controls.stop();
    } else {
      count.set(1);
      return;
    }
  }, [isStarted, number, duration, count]);

  return (
    <motion.div
      onViewportEnter={() => setIsStarted(true)}
      onViewportLeave={() => setIsStarted(false)}
      viewport={{ once: false }}
    >
      <motion.div>{rounded}</motion.div>
    </motion.div>
  );
}

export default NumberRiser;
