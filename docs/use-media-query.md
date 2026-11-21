# useMediaQuery

Returns whether a CSS media query matches, and re-renders when that changes.

```ts
import { useMediaQuery } from 'mxs/react';

const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
```

## Signature

```ts
useMediaQuery(query: string): boolean
```

## Behavior

- Built on `useSyncExternalStore` and `matchMedia`.
- Renders `false` on the server.
