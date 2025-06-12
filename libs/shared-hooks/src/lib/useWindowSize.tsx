import { useEffect, useState } from 'react';

interface WindowSize {
  width: number | null;
  height: number | null;
}

/**
 * A custom hook that provides the current window size, updating its value when the window is resized.
 *
 * The width and height are returned in an object, initially set to null, and updated with the current
 * window dimensions. The resize event is throttled according to the specified delay.
 *
 * @param {number} [throttleDelay=100] - The delay in milliseconds to throttle the resize event handler (default is 100ms).
 * @returns {WindowSize} - An object containing the width and height of the window.
 */

export function useWindowSize(throttleDelay = 100): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: null,
    height: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout | null = null;

    const handleResize = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
          timeoutId = null;
        }, throttleDelay);
      }
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [throttleDelay]);

  return windowSize;
}

export default useWindowSize;
