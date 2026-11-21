import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { ParsedStorageStateOptions, Parse, SetValue, StorageState, StorageStateOptions } from './types';

const sameTabListeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
  sameTabListeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    sameTabListeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
};

const notify = () => {
  for (const listener of sameTabListeners) {
    listener();
  }
};

const getServerSnapshot = () => null;

const attempt = <R>(run: () => R): R | null => {
  try {
    return run();
  } catch {
    return null;
  }
};

/**
 * Like `useState`, persisted as JSON in `localStorage` and synced across hooks and tabs.
 * Missing, corrupt or rejected data falls back to `initialValue`, as does the server render.
 *
 * @param key - the storage key
 * @param options - `initialValue`, an optional `parse` validator that sets the type, and optional `storage`
 * @returns `[value, setValue, remove]`
 *
 * @example
 * const [count, setCount] = useStorageState('count', { initialValue: 0 })
 * const [theme] = useStorageState('theme', { initialValue: 'light', parse: (v) => (v === 'dark' ? v : null) })
 */
export function useStorageState<const T>(key: string, options: ParsedStorageStateOptions<T>): StorageState<T>;
export function useStorageState<T>(key: string, options: StorageStateOptions<T>): StorageState<T>;
export function useStorageState<T>(
  key: string,
  options: StorageStateOptions<T> & { parse?: Parse<T> },
): StorageState<T> {
  const { initialValue, parse } = options;
  const storage = useCallback(() => options.storage ?? localStorage, [options.storage]);
  const raw = useSyncExternalStore(subscribe, () => attempt(() => storage().getItem(key)), getServerSnapshot);

  const decode = useCallback(
    (text: string | null): T | null => {
      if (text === null) {
        return null;
      }
      const value: unknown = attempt(() => JSON.parse(text));
      // Without `parse`, the caller vouches that stored JSON matches `initialValue`.
      return parse ? parse(value) : (value as T | null);
    },
    [parse],
  );
  const value = useMemo(() => decode(raw), [decode, raw]) ?? initialValue;

  const setValue: SetValue<T> = useCallback(
    (next) => {
      const previous = decode(attempt(() => storage().getItem(key))) ?? initialValue;
      // `typeof` cannot tell an updater from a `T` that is a function. A function is read as an updater.
      const resolved = typeof next === 'function' ? (next as (previous: T) => T)(previous) : next;
      attempt(() => storage().setItem(key, JSON.stringify(resolved)));
      notify();
    },
    [decode, initialValue, key, storage],
  );

  const remove = useCallback(() => {
    attempt(() => storage().removeItem(key));
    notify();
  }, [key, storage]);

  return [value, setValue, remove];
}
