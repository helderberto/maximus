import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls once with the last arguments after the wait', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, { wait: 100 });
    debounced('a');
    vi.advanceTimersByTime(50);
    debounced('b');
    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledExactlyOnceWith('b');
  });

  it('calls on the leading edge and skips a lone trailing call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, { wait: 100, leading: true });
    debounced('a');
    expect(fn).toHaveBeenCalledExactlyOnceWith('a');
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calls trailing after leading when called again in the wait', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, { wait: 100, leading: true });
    debounced('a');
    debounced('b');
    vi.advanceTimersByTime(100);
    expect(fn.mock.calls).toEqual([['a'], ['b']]);
  });

  it('cancels a pending call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, { wait: 100 });
    debounced('a');
    debounced.cancel();
    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });

  it('flushes a pending call immediately', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, { wait: 100 });
    debounced('a');
    debounced.flush();
    expect(fn).toHaveBeenCalledExactlyOnceWith('a');
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('cancels and ignores calls once the signal aborts', () => {
    const fn = vi.fn();
    const controller = new AbortController();
    const debounced = debounce(fn, { wait: 100, signal: controller.signal });
    debounced('a');
    controller.abort();
    debounced('b');
    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });

  it('keeps the argument types', () => {
    const debounced = debounce((query: string, page: number) => [query, page], { wait: 1 });
    expectTypeOf(debounced).parameters.toEqualTypeOf<[string, number]>();
  });
});
