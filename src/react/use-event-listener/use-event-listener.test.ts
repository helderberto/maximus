// @vitest-environment happy-dom
import { fireEvent, renderHook } from '@testing-library/react';
import { useEventListener } from './use-event-listener';

describe('useEventListener', () => {
  it('listens on a target', () => {
    const listener = vi.fn();
    renderHook(() => useEventListener(window, { type: 'resize', listener }));
    fireEvent(window, new Event('resize'));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('listens on a ref target', () => {
    const element = document.createElement('button');
    document.body.append(element);
    const listener = vi.fn();
    renderHook(() => useEventListener({ current: element }, { type: 'click', listener }));
    fireEvent.click(element);
    expect(listener).toHaveBeenCalledTimes(1);
    element.remove();
  });

  it('ignores a null target', () => {
    expect(() => renderHook(() => useEventListener(null, { type: 'click', listener: vi.fn() }))).not.toThrow();
  });

  it('calls the latest listener', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ listener }) => useEventListener(window, { type: 'resize', listener }), {
      initialProps: { listener: first },
    });
    rerender({ listener: second });
    fireEvent(window, new Event('resize'));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('removes the listener on unmount', () => {
    const listener = vi.fn();
    const { unmount } = renderHook(() => useEventListener(document, { type: 'keydown', listener }));
    unmount();
    fireEvent.keyDown(document);
    expect(listener).not.toHaveBeenCalled();
  });

  it('types the event from the target and type', () => {
    renderHook(() =>
      useEventListener(window, {
        type: 'keydown',
        listener: (event) => expectTypeOf(event).toEqualTypeOf<KeyboardEvent>(),
      }),
    );
    // @ts-expect-error: 'nope' is not a window event, so the call must not type-check.
    renderHook(() => useEventListener(window, { type: 'nope', listener: vi.fn() }));
  });
});
