export interface RetryContext {
  /** The current attempt, starting at 1. */
  attempt: number;
  /** The `signal` passed in the options. Forward it to cancel in-flight work. */
  signal?: AbortSignal;
}

export interface RetryOptions {
  /** Total number of calls, including the first. */
  attempts: number;
  /**
   * Milliseconds to wait after a failed attempt.
   * @defaultValue exponential with full jitter, up to 100ms, 200ms, 400ms, capped at 30s
   */
  backoff?: (attempt: number) => number;
  /** Return `false` to stop and reject with this error right away. */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  /** Aborting stops further attempts and rejects with `signal.reason`. */
  signal?: AbortSignal;
}
