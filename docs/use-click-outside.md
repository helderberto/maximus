# useClickOutside

Calls a handler on a pointer press outside one or more elements.

```ts
import { useClickOutside } from 'mxs/react';

useClickOutside([menuRef, toggleRef], { onClickOutside: () => setOpen(false) });
```

## Signature

```ts
useClickOutside(refs: RefObject<Element | null> | RefObject<Element | null>[], options: { onClickOutside: (event: PointerEvent) => void }): void
```

## Behavior

- Listens to `pointerdown` on `document`, so mouse, touch and pen all count.
- With several refs, a press inside any of them is inside. Use it for a menu and its toggle button.
- Safe on the server: it does nothing without `document`.
