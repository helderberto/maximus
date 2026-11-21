type Selector<T> = (item: T) => unknown;

interface RemoveDuplicatesOptions<T> {
  by: keyof T | Selector<T>;
}

const toSelector = <T>(by: keyof T | Selector<T>): Selector<T> =>
  typeof by === 'function' ? by : (item: T) => item[by];

/**
 * Returns a new array without duplicates, keeping the first occurrence.
 * Values are compared with `Set` semantics, so falsy keys like `0` and `''` are ordinary values.
 *
 * @param items - the array to deduplicate; it is not mutated
 * @param options - `by` picks the comparison value: a key of the item or a selector function
 *
 * @example
 * removeDuplicates([1, 2, 1]) // => [1, 2]
 * removeDuplicates(users, { by: 'id' })
 * removeDuplicates(words, { by: (word) => word.toLowerCase() })
 */
export const removeDuplicates = <T>(items: readonly T[], options?: RemoveDuplicatesOptions<T>): T[] => {
  const select = options ? toSelector(options.by) : (item: T) => item;
  const seen = new Set<unknown>();
  return items.filter((item) => {
    const value = select(item);
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};
