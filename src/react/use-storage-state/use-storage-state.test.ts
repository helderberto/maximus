// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { useStorageState } from './use-storage-state';

const parseTheme = (value: unknown) => (value === 'light' || value === 'dark' ? value : null);

describe('useStorageState', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('returns the initial value when the key is missing', () => {
    const { result } = renderHook(() => useStorageState('count', { initialValue: 0 }));
    expect(result.current[0]).toBe(0);
  });

  it('reads the stored value', () => {
    localStorage.setItem('count', '5');
    const { result } = renderHook(() => useStorageState('count', { initialValue: 0 }));
    expect(result.current[0]).toBe(5);
  });

  it('writes values and updaters to storage', () => {
    const { result } = renderHook(() => useStorageState('count', { initialValue: 0 }));
    act(() => result.current[1](2));
    act(() => result.current[1]((count) => count + 1));
    expect(result.current[0]).toBe(3);
    expect(localStorage.getItem('count')).toBe('3');
  });

  it('removes the value and falls back to the initial value', () => {
    localStorage.setItem('count', '5');
    const { result } = renderHook(() => useStorageState('count', { initialValue: 0 }));
    act(() => result.current[2]());
    expect(result.current[0]).toBe(0);
    expect(localStorage.getItem('count')).toBeNull();
  });

  it('syncs hooks using the same key in one tab', () => {
    const first = renderHook(() => useStorageState('count', { initialValue: 0 }));
    const second = renderHook(() => useStorageState('count', { initialValue: 0 }));
    act(() => first.result.current[1](7));
    expect(second.result.current[0]).toBe(7);
  });

  it('syncs changes from other tabs', () => {
    const { result } = renderHook(() => useStorageState('count', { initialValue: 0 }));
    act(() => {
      localStorage.setItem('count', '9');
      window.dispatchEvent(new StorageEvent('storage', { key: 'count' }));
    });
    expect(result.current[0]).toBe(9);
  });

  it.each(['"blue"', '{oops'])('falls back to the initial value for stored %s', (stored) => {
    localStorage.setItem('theme', stored);
    const { result } = renderHook(() => useStorageState('theme', { initialValue: 'light', parse: parseTheme }));
    expect(result.current[0]).toBe('light');
  });

  it('uses another storage', () => {
    const { result } = renderHook(() => useStorageState('count', { initialValue: 0, storage: sessionStorage }));
    act(() => result.current[1](4));
    expect(sessionStorage.getItem('count')).toBe('4');
    sessionStorage.clear();
  });

  it('renders the initial value on the server', () => {
    localStorage.setItem('count', '5');
    const Probe = () => String(useStorageState('count', { initialValue: 0 })[0]);
    expect(renderToString(createElement(Probe))).toBe('0');
  });

  it('infers a widened value type from initialValue', () => {
    const { result } = renderHook(() => useStorageState('count', { initialValue: 0 }));
    expectTypeOf(result.current[0]).toEqualTypeOf<number>();
  });

  it('infers the value type from parse', () => {
    const { result } = renderHook(() => useStorageState('theme', { initialValue: 'light', parse: parseTheme }));
    expectTypeOf(result.current[0]).toEqualTypeOf<'light' | 'dark'>();
  });
});
