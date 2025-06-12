import { RefObject, useCallback, useEffect } from 'react';

/**
 * A custom React hook that triggers a callback when a click occurs outside the specified element.
 *
 * @param {RefObject<T>} ref - Ref of the target element to detect outside clicks for.
 * @param {() => void} callback - Callback function to invoke when an outside click is detected.
 *
 * @template T - The type of the referenced HTMLElement or null.
 */
export function useClickOutside<T extends HTMLElement | null>(
  ref: RefObject<T>,
  callback: () => void
) {
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) {
        callback();
      }
    },
    [callback, ref]
  );

  useEffect(() => {
    if (!ref.current) return;
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [handleClick, ref]);
}

export default useClickOutside;
