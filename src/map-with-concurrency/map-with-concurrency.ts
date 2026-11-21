export interface MapWithConcurrencyOptions<T, R> {
  /** Maximum calls in flight. A value below 1 counts as 1. */
  limit: number;
  /** Maps one item. Receives the item and its index. */
  fn: (item: T, index: number) => Promise<R>;
}

/**
 * Maps items through an async function with at most `limit` calls running at once.
 * Results keep input order. The first rejection rejects the whole call and stops new items from starting.
 *
 * @param items - the items to map; the array is not mutated
 * @param options - `limit` caps concurrent calls, and below 1 counts as 1; `fn` maps one item
 *
 * @example
 * await mapWithConcurrency(urls, { limit: 4, fn: (url) => fetch(url) })
 */
export const mapWithConcurrency = async <T, R>(
  items: readonly T[],
  options: MapWithConcurrencyOptions<T, R>,
): Promise<R[]> => {
  const results = new Array<R>(items.length);
  let next = 0;
  let failed = false;
  const worker = async () => {
    while (!failed && next < items.length) {
      const index = next;
      next += 1;
      try {
        results[index] = await options.fn(items[index], index);
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  };
  const workerCount = Math.min(items.length, Math.max(1, Math.floor(options.limit)));
  await Promise.all(Array.from({ length: workerCount }, worker));
  return results;
};
