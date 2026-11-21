export interface DedupeInFlightOptions<Args extends unknown[]> {
  /**
   * Derives the dedupe key from the arguments.
   * @defaultValue `JSON.stringify(args)`
   */
  key: (...args: Args) => string;
}

/**
 * Wraps an async function so concurrent calls with the same key share one pending promise.
 * Once the promise settles, the next call runs `fn` again. Nothing is cached.
 *
 * @param fn - the async function to wrap
 * @param options - `key` derives the dedupe key from the arguments; defaults to `JSON.stringify(args)`
 *
 * @example
 * const fetchUser = dedupeInFlight((id: string) => fetch(`/users/${id}`).then((r) => r.json()))
 */
export const dedupeInFlight = <Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  options?: DedupeInFlightOptions<Args>,
): ((...args: Args) => Promise<R>) => {
  const toKey = options?.key ?? ((...args: Args) => JSON.stringify(args));
  const pending = new Map<string, Promise<R>>();
  return (...args) => {
    const key = toKey(...args);
    const existing = pending.get(key);
    if (existing) {
      return existing;
    }
    const promise = fn(...args).finally(() => pending.delete(key));
    pending.set(key, promise);
    return promise;
  };
};
