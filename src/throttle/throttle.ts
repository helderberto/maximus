import type { Throttled, ThrottleOptions } from './types';

/**
 * Calls `fn` at most once per `wait` ms: immediately on the first call, then once more
 * at the end of the window with the last arguments, if calls came in meanwhile.
 *
 * @param fn - the function to throttle
 * @param options - `wait` in ms; `signal` cancels and disables on abort
 *
 * @example
 * window.addEventListener('scroll', throttle(updatePosition, { wait: 100 }))
 */
export const throttle = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  options: ThrottleOptions,
): Throttled<Args> => {
  const { wait, signal } = options;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pendingArgs: Args | null = null;

  const invoke = (args: Args) => {
    fn(...args);
    timer = setTimeout(() => {
      timer = undefined;
      flush();
    }, wait);
  };
  const stopTimer = () => {
    clearTimeout(timer);
    timer = undefined;
  };
  const flush = () => {
    if (pendingArgs) {
      const args = pendingArgs;
      pendingArgs = null;
      stopTimer();
      invoke(args);
    }
  };
  const cancel = () => {
    stopTimer();
    pendingArgs = null;
  };
  const throttled = (...args: Args) => {
    if (signal?.aborted) {
      return;
    }
    if (timer === undefined) {
      invoke(args);
    } else {
      pendingArgs = args;
    }
  };

  signal?.addEventListener('abort', cancel, { once: true });
  return Object.assign(throttled, { cancel, flush });
};
