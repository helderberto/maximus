import type { Debounced, DebounceOptions } from './types';

/**
 * Delays calls to `fn` until `wait` ms pass without a new call, then calls it with the last arguments.
 *
 * @param fn - the function to debounce
 * @param options - `wait` in ms; `leading` also calls on the first call; `signal` cancels and disables on abort
 *
 * @example
 * const save = debounce((text: string) => api.save(text), { wait: 300 })
 * save.flush() // run the pending call now
 * save.cancel() // drop it
 */
export const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  options: DebounceOptions,
): Debounced<Args> => {
  const { wait, leading = false, signal } = options;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pendingArgs: Args | null = null;

  const invokePending = () => {
    if (pendingArgs) {
      const args = pendingArgs;
      pendingArgs = null;
      fn(...args);
    }
  };
  const stopTimer = () => {
    clearTimeout(timer);
    timer = undefined;
  };
  const cancel = () => {
    stopTimer();
    pendingArgs = null;
  };
  const flush = () => {
    stopTimer();
    invokePending();
  };
  const debounced = (...args: Args) => {
    if (signal?.aborted) {
      return;
    }
    const isIdle = timer === undefined;
    stopTimer();
    timer = setTimeout(flush, wait);
    if (leading && isIdle) {
      fn(...args);
    } else {
      pendingArgs = args;
    }
  };

  signal?.addEventListener('abort', cancel, { once: true });
  return Object.assign(debounced, { cancel, flush });
};
