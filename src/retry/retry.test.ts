import { retry } from './retry';

const noDelay = () => 0;

describe('retry', () => {
  it('resolves with the first successful result', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('a')).mockResolvedValueOnce('ok');
    await expect(retry(fn, { attempts: 3, backoff: noDelay })).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('rejects with the last error after all attempts', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('first')).mockRejectedValueOnce(new Error('last'));
    await expect(retry(fn, { attempts: 2, backoff: noDelay })).rejects.toThrow('last');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('passes the 1-based attempt number', async () => {
    const attempts: number[] = [];
    await retry(
      async ({ attempt }) => {
        attempts.push(attempt);
        if (attempt < 3) {
          throw new Error('retry');
        }
      },
      { attempts: 3, backoff: noDelay },
    );
    expect(attempts).toEqual([1, 2, 3]);
  });

  it('stops when shouldRetry returns false', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fatal'));
    await expect(retry(fn, { attempts: 5, backoff: noDelay, shouldRetry: () => false })).rejects.toThrow('fatal');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('waits for the backoff delay between attempts', async () => {
    vi.useFakeTimers();
    const fn = vi.fn().mockRejectedValueOnce(new Error('a')).mockResolvedValueOnce('ok');
    const promise = retry(fn, { attempts: 2, backoff: () => 1000 });
    await vi.advanceTimersByTimeAsync(999);
    expect(fn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toBe('ok');
    vi.useRealTimers();
  });

  it('uses exponential backoff with jitter by default', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const fn = vi.fn().mockRejectedValueOnce(new Error('a')).mockRejectedValueOnce(new Error('b')).mockResolvedValue(1);
    const promise = retry(fn, { attempts: 3 });
    await vi.advanceTimersByTimeAsync(100);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(199);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toBe(1);
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('rejects with the abort reason when aborted during a delay', async () => {
    const controller = new AbortController();
    const fn = vi.fn().mockRejectedValue(new Error('a'));
    const promise = retry(fn, { attempts: 3, backoff: () => 10_000, signal: controller.signal });
    await Promise.resolve();
    controller.abort(new Error('stopped'));
    await expect(promise).rejects.toThrow('stopped');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not call fn when the signal is already aborted', async () => {
    const fn = vi.fn();
    await expect(retry(fn, { attempts: 3, signal: AbortSignal.abort(new Error('early')) })).rejects.toThrow('early');
    expect(fn).not.toHaveBeenCalled();
  });

  it('infers the result type', () => {
    expectTypeOf(retry(async () => 42, { attempts: 1 })).toEqualTypeOf<Promise<number>>();
  });
});
