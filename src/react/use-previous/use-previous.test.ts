// @vitest-environment happy-dom
import { renderHook } from '@testing-library/react';
import { usePrevious } from './use-previous';

describe('usePrevious', () => {
  it('returns null on the first render', () => {
    const { result } = renderHook(() => usePrevious(1));
    expect(result.current).toBeNull();
  });

  it('returns the previous distinct value', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), { initialProps: { value: 1 } });
    rerender({ value: 2 });
    expect(result.current).toBe(1);
    rerender({ value: 3 });
    expect(result.current).toBe(2);
  });

  it('keeps the previous value across re-renders with the same value', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), { initialProps: { value: 1 } });
    rerender({ value: 2 });
    rerender({ value: 2 });
    expect(result.current).toBe(1);
  });

  it('infers the value type', () => {
    const { result } = renderHook(() => usePrevious('a'));
    expectTypeOf(result.current).toEqualTypeOf<string | null>();
  });
});
