import type { RefObject } from 'react';
import { useEventListener } from '@/react/use-event-listener';

type ElementRef = RefObject<Element | null>;

export interface UseClickOutsideOptions {
  /** Called on a `pointerdown` outside every given element. */
  onClickOutside: (event: PointerEvent) => void;
}

/**
 * Calls `onClickOutside` on a pointer press outside every given element.
 * Pass several refs to treat them all as inside, like a menu and its toggle button.
 *
 * @param refs - one ref or a list of refs
 * @param options - `onClickOutside` receives the `PointerEvent`
 *
 * @example
 * useClickOutside(menuRef, { onClickOutside: () => setOpen(false) })
 */
export const useClickOutside = (refs: ElementRef | readonly ElementRef[], options: UseClickOutsideOptions): void => {
  useEventListener(typeof document === 'undefined' ? null : document, {
    type: 'pointerdown',
    listener: (event) => {
      const target = event.target instanceof Node ? event.target : null;
      const list: readonly ElementRef[] = Array.isArray(refs) ? refs : [refs];
      if (!list.some((ref) => ref.current?.contains(target))) {
        options.onClickOutside(event);
      }
    },
  });
};
