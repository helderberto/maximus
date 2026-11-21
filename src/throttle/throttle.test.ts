import { throttle } from './throttle';

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls immediately, then at most once per wait with the last arguments', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, { wait: 100 });
    throttled('a');
    throttled('b');
    throttled('c');
    expect(fn.mock.calls).toEqual([['a']]);
    vi.advanceTimersByTime(100);
    expect(fn.mock.calls).toEqual([['a'], ['c']]);
  });

  it('skips the trailing call when nothing came in the wait', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, { wait: 100 });
    throttled('a');
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calls on the leading edge again after a quiet wait', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, { wait: 100 });
    throttled('a');
    vi.advanceTimersByTime(250);
    throttled('b');
    expect(fn.mock.calls).toEqual([['a'], ['b']]);
  });

  it('cancels a pending trailing call', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, { wait: 100 });
    throttled('a');
    throttled('b');
    throttled.cancel();
    vi.advanceTimersByTime(100);
    expect(fn.mock.calls).toEqual([['a']]);
  });

  it('flushes a pending trailing call', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, { wait: 100 });
    throttled('a');
    throttled('b');
    throttled.flush();
    expect(fn.mock.calls).toEqual([['a'], ['b']]);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('ignores calls once the signal aborts', () => {
    const fn = vi.fn();
    const controller = new AbortController();
    const throttled = throttle(fn, { wait: 100, signal: controller.signal });
    throttled('a');
    throttled('b');
    controller.abort();
    throttled('c');
    vi.advanceTimersByTime(100);
    expect(fn.mock.calls).toEqual([['a']]);
  });

  it('keeps the argument types', () => {
    const throttled = throttle((x: number) => x, { wait: 1 });
    expectTypeOf(throttled).parameters.toEqualTypeOf<[number]>();
  });
});
