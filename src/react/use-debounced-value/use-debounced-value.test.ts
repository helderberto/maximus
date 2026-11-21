// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react';
import { useDebouncedValue } from './use-debounced-value';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('a', { wait: 100 }));
    expect(result.current).toBe('a');
  });

  it('updates only after the value stops changing for the wait', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, { wait: 100 }), {
      initialProps: { value: 'a' },
    });
    rerender({ value: 'b' });
    act(() => vi.advanceTimersByTime(50));
    rerender({ value: 'c' });
    act(() => vi.advanceTimersByTime(99));
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('c');
  });

  it('infers the value type', () => {
    const { result } = renderHook(() => useDebouncedValue(1, { wait: 1 }));
    expectTypeOf(result.current).toEqualTypeOf<number>();
  });
});
