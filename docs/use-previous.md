# usePrevious

Returns the previous distinct value.

```ts
import { usePrevious } from 'mxs/react';

const previousCount = usePrevious(count);
```

## Signature

```ts
usePrevious<T>(value: T): T | null
```

## Behavior

- Returns `null` until the value first changes.
- Re-renders with an unchanged value keep the same previous value.
- Values are compared with `Object.is`.
- Built on state, not on a ref written during render, so it is safe in concurrent rendering.
