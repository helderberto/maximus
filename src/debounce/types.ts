export interface DebounceOptions {
  /** Quiet time in ms before the call runs. */
  wait: number;
  /**
   * Also call on the first call of a burst.
   * @defaultValue `false`
   */
  leading?: boolean;
  /** Aborting cancels the pending call and ignores later ones. */
  signal?: AbortSignal;
}

export interface Debounced<Args extends unknown[]> {
  (...args: Args): void;
  /** Drops the pending call. */
  cancel: () => void;
  /** Runs the pending call now. Does nothing when none is pending. */
  flush: () => void;
}
