import { useCallback, useEffect, useRef } from 'react';

/**
 * A custom React hook for managing a timer (setInterval) with the ability
 * to start, reset, and automatically clear the interval when the component unmounts.
 *
 * @returns {{
 *   setTimeInterval: (seconds: number, callback: () => void) => void,
 *   resetTimer: () => void
 * }}
 *
 * @property {function} setTimeInterval - Starts a timer that calls the given callback every specified number of seconds.
 * @property {function} resetTimer - Resets the timer, using the previously stored interval duration and callback.
 */
export const useTimer = () => {
  // 存储intervalId
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callBackRef = useRef<(() => void) | null>(null);
  const intervalDurationRef = useRef<number | null>(null);

  const setTimeInterval = useCallback((seconds: number, callback: () => void) => {
    // 现存储callback和事件间隔
    callBackRef.current = callback;
    intervalDurationRef.current = seconds;

    // 清除已有的定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 设置新的定时器
    intervalRef.current = setInterval(() => {
      callBackRef.current?.();
    }, seconds * 1000);
  }, []);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (callBackRef.current && intervalDurationRef.current) {
      intervalRef.current = setInterval(() => {
        callBackRef.current?.();
      }, intervalDurationRef.current * 1000);
    }
  }, []);

  // 清除 intervalId 防止组件卸载时内存泄露
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    setTimeInterval,
    resetTimer,
  };
};

export default useTimer;
