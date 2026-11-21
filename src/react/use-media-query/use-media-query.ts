import { useCallback, useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

/**
 * Returns whether a CSS media query matches, and re-renders when that changes.
 * Renders `false` on the server.
 *
 * @example
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, getServerSnapshot);
};
