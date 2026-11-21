import { useEffect, useRef } from 'react';

export interface UseIntervalOptions {
  /** Time in ms between calls. `null` pauses the interval. */
  delay: number | null;
}

/**
 * Calls `callback` every `delay` ms. A `null` delay pauses it.
 * Changing the callback does not restart the interval.
 *
 * @param callback - called on each tick; the latest one is used
 * @param options - `delay` in ms, or `null` to pause
 *
 * @example
 * useInterval(() => setSeconds((s) => s + 1), { delay: isRunning ? 1000 : null })
 */
export const useInterval = (callback: () => void, options: UseIntervalOptions): void => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  const { delay } = options;
  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => callbackRef.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};
