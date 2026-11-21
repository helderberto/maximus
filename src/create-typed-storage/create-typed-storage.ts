import type { TypedStorage, TypedStorageOptions } from './types';

const attempt = <R>(run: () => R): R | null => {
  try {
    return run();
  } catch {
    return null;
  }
};

/**
 * Wraps one storage key with JSON serialization and validation.
 * Never throws: a missing key, corrupt JSON, a rejected value or unavailable storage reads as `null`.
 *
 * @param options - `key`, a `parse` validator returning the value or `null`, and an optional `storage` that defaults to `localStorage`
 *
 * @example
 * const theme = createTypedStorage({ key: 'theme', parse: (v) => (v === 'dark' || v === 'light' ? v : null) })
 * theme.set('dark')
 * theme.get() // => 'dark'
 */
export const createTypedStorage = <T>(options: TypedStorageOptions<T>): TypedStorage<T> => {
  const { key, parse } = options;
  const storage = () => options.storage ?? globalThis.localStorage;
  return {
    get: () =>
      attempt(() => {
        const raw = storage().getItem(key);
        return raw === null ? null : parse(JSON.parse(raw));
      }),
    set: (value) =>
      attempt(() => {
        storage().setItem(key, JSON.stringify(value));
        return true;
      }) ?? false,
    remove: () => {
      attempt(() => storage().removeItem(key));
    },
  };
};
