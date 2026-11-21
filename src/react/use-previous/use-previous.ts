import { useState } from 'react';

interface PreviousState<T> {
  current: T;
  previous: T | null;
}

/**
 * Returns the previous distinct value, or `null` before the value first changes.
 * Re-renders with an unchanged value keep the same previous value.
 *
 * @example
 * const previousCount = usePrevious(count)
 */
export const usePrevious = <T>(value: T): T | null => {
  const [state, setState] = useState<PreviousState<T>>({ current: value, previous: null });
  if (!Object.is(state.current, value)) {
    setState({ current: value, previous: state.current });
    return state.current;
  }
  return state.previous;
};
