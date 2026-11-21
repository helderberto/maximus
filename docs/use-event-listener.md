# useEventListener

Adds an event listener to a target or a ref, and removes it on unmount.

```ts
import { useEventListener } from 'mxs/react';

useEventListener(window, {
  type: 'keydown',
  listener: (event) => event.key, // event: KeyboardEvent
});

useEventListener(buttonRef, { type: 'click', listener: onClick });
```

## Signature

```ts
useEventListener(target: EventTarget | RefObject | null, options: { type; listener; capture?: boolean; passive?: boolean }): void
```

## Behavior

- The event type comes from the target: `Window`, `Document`, `HTMLElement` and `MediaQueryList` are typed.
- An unknown event `type` for the target is a compile-time error.
- Changing the listener does not re-subscribe. The latest one is called.
- A `null` target skips the listener. A ref is read after mount.
