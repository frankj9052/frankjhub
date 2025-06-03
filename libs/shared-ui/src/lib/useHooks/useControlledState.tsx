import { Dispatch, SetStateAction, useState } from 'react';

/**
 * A custom hook that manages a stateful value with controlled and uncontrolled modes.
 *
 * @template T - The type of the state value.
 * @param {T | undefined} controlledValue - The external controlled value (if provided, the state is controlled).
 * @param {T} defaultValue - The initial value used when the state is uncontrolled.
 * @returns {[T, (newValue: T) => void]} - Returns the current value and a setter function.
 *   - If `controlledValue` is provided, the returned value is always `controlledValue`, and the setter function does nothing.
 *   - If `controlledValue` is `undefined`, the hook manages the state internally using `useState`, and the setter updates the internal state.
 */
export const useControlledState = <T,>(
  controlledValue: T | undefined,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>> | undefined] => {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const setValue = isControlled ? undefined : setInternalValue;
  return [value, setValue];
};
