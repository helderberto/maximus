import { useEffect, useRef, type RefObject } from 'react';
import type { EventMapOf, UseEventListenerOptions } from './types';

/**
 * Adds an event listener to a target or a ref, removing it on unmount.
 * The event type is inferred from the target. Changing the listener does not re-subscribe.
 *
 * @param target - an `EventTarget`, a ref to one, or `null` to skip; a ref is read after mount
 * @param options - `type`, `listener`, and optional `capture` and `passive`
 *
 * @example
 * useEventListener(window, { type: 'keydown', listener: (event) => event.key })
 */
export const useEventListener = <T extends EventTarget, K extends keyof EventMapOf<T> & string>(
  target: T | RefObject<T | null> | null,
  options: UseEventListenerOptions<T, K>,
): void => {
  const { type, capture = false, passive } = options;
  const listenerRef = useRef(options.listener);
  useEffect(() => {
    listenerRef.current = options.listener;
  });
  useEffect(() => {
    const element = target !== null && 'addEventListener' in target ? target : target?.current;
    if (!element) {
      return;
    }
    // The DOM types the event as `Event`. The target's event map narrows it for this `type`.
    const handle = (event: Event) => listenerRef.current(event as EventMapOf<T>[K]);
    element.addEventListener(type, handle, { capture, passive });
    return () => element.removeEventListener(type, handle, { capture });
  }, [target, type, capture, passive]);
};
