// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react';
import { useInterval } from './use-interval';

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the callback every delay', () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, { delay: 100 }));
    act(() => vi.advanceTimersByTime(350));
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('pauses when delay is null', () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, { delay: null }));
    act(() => vi.advanceTimersByTime(1000));
    expect(callback).not.toHaveBeenCalled();
  });

  it('calls the latest callback without restarting the interval', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ callback }) => useInterval(callback, { delay: 100 }), {
      initialProps: { callback: first },
    });
    act(() => vi.advanceTimersByTime(60));
    rerender({ callback: second });
    act(() => vi.advanceTimersByTime(40));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('stops on unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useInterval(callback, { delay: 100 }));
    unmount();
    act(() => vi.advanceTimersByTime(500));
    expect(callback).not.toHaveBeenCalled();
  });
});
