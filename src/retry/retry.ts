import type { RetryContext, RetryOptions } from './types';

const BASE_DELAY_MS = 100;
const MAX_DELAY_MS = 30_000;

const exponentialBackoff = (attempt: number) =>
  Math.random() * Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** (attempt - 1));

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    signal?.throwIfAborted();
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });

/**
 * Calls `fn` until it resolves, up to `attempts` times, waiting between attempts.
 * The default backoff is exponential with full jitter: up to 100ms, 200ms, 400ms, capped at 30s.
 *
 * @param fn - receives the 1-based `attempt` and the `signal`
 * @param options - `attempts`, plus optional `backoff`, `shouldRetry` and `signal`
 *
 * @example
 * await retry(({ signal }) => fetch(url, { signal }), { attempts: 3, signal })
 */
export const retry = async <T>(fn: (context: RetryContext) => Promise<T>, options: RetryOptions): Promise<T> => {
  const { attempts, backoff = exponentialBackoff, shouldRetry = () => true, signal } = options;
  for (let attempt = 1; ; attempt += 1) {
    signal?.throwIfAborted();
    try {
      return await fn({ attempt, signal });
    } catch (error) {
      if (attempt >= attempts || !shouldRetry(error, attempt)) {
        throw error;
      }
    }
    await sleep(backoff(attempt), signal);
  }
};
