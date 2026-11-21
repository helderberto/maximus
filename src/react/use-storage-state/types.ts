export type Parse<T> = (value: unknown) => T | null;

export type SetValue<T> = (next: T | ((previous: T) => T)) => void;

export type StorageState<T> = readonly [value: T, setValue: SetValue<T>, remove: () => void];

export interface StorageStateOptions<T> {
  /** Used when the key is missing, the data is invalid, or on the server. */
  initialValue: T;
  /**
   * Any `Storage`, such as `sessionStorage`.
   * @defaultValue `localStorage`
   */
  storage?: Storage;
}

export interface ParsedStorageStateOptions<T> extends Omit<StorageStateOptions<T>, 'initialValue'> {
  /** Used when the key is missing, the data is invalid, or on the server. */
  initialValue: NoInfer<T>;
  /** Validates stored JSON and sets the value type. Return `null` to reject. */
  parse: Parse<T>;
}
