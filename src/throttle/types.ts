export interface ThrottleOptions {
  /** Minimum time in ms between calls. */
  wait: number;
  /** Aborting cancels the pending call and ignores later ones. */
  signal?: AbortSignal;
}

export interface Throttled<Args extends unknown[]> {
  (...args: Args): void;
  /** Drops the pending trailing call. */
  cancel: () => void;
  /** Runs the pending trailing call now. Does nothing when none is pending. */
  flush: () => void;
}
