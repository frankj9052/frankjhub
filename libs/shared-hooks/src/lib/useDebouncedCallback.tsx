import { useMemo, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';

/**
 * A custom React hook that returns a debounced version of a callback,
 * delaying its execution until after a specified delay time has passed since the last call.
 *
 * @template T - The type of the callback function.
 *
 * @param {T} callback - The callback function to debounce.
 * @param {number} [delay=500] - Optional. Delay time in milliseconds (default is 500ms).
 *
 * @returns {T} A debounced version of the original callback function.
 */
export const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay = 500
) => {
  const callbackRef = useRef(callback);

  // 每次 callback 更新时，更新 ref
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedFn = useMemo(() => {
    return debounce((...args: Parameters<T>) => {
      callbackRef.current(...args);
    }, delay ?? 500);
  }, [delay]);

  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
};

export default useDebouncedCallback;
