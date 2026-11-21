export type EventMapOf<T> = T extends Window
  ? WindowEventMap
  : T extends Document
    ? DocumentEventMap
    : T extends HTMLElement
      ? HTMLElementEventMap
      : T extends MediaQueryList
        ? MediaQueryListEventMap
        : Record<string, Event>;

export interface UseEventListenerOptions<T, K extends keyof EventMapOf<T>> {
  /** The event name, checked against the target's event map. */
  type: K;
  /** Receives the event typed for `type`. The latest listener is called without re-subscribing. */
  listener: (event: EventMapOf<T>[K]) => void;
  /** Listen in the capture phase. */
  capture?: boolean;
  /** Promise never to call `preventDefault`, so scrolling stays smooth. */
  passive?: boolean;
}
