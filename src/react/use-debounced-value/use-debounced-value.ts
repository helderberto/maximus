import { useEffect, useState } from 'react';

export interface UseDebouncedValueOptions {
  /** Quiet time in ms before the value updates. */
  wait: number;
}

/**
 * Returns `value` once it stops changing for `wait` ms. Useful for search inputs.
 *
 * @param value - the value to debounce
 * @param options - `wait` in ms
 *
 * @example
 * const debouncedQuery = useDebouncedValue(query, { wait: 300 })
 */
export const useDebouncedValue = <T>(value: T, options: UseDebouncedValueOptions): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), options.wait);
    return () => clearTimeout(timer);
  }, [value, options.wait]);
  return debounced;
};
