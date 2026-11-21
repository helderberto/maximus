export interface TypedStorageOptions<T> {
  /** The storage key. */
  key: string;
  /** Validates the parsed JSON. Return the value, or `null` to reject it. Sets the value type. */
  parse: (value: unknown) => T | null;
  /**
   * Where to store the value. Read lazily, so creating it during SSR is safe.
   * @defaultValue `localStorage`
   */
  storage?: Storage;
}

export interface TypedStorage<T> {
  /** Reads the value. `null` when missing, corrupt, rejected by `parse`, or storage is unavailable. */
  get: () => T | null;
  /** Writes the value as JSON. Returns `false` when the write fails, for example on a full quota. */
  set: (value: T) => boolean;
  /** Removes the key. Never throws. */
  remove: () => void;
}
