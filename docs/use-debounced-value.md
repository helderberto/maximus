# useDebouncedValue

Returns a value once it stops changing for `wait` ms.

```ts
import { useDebouncedValue } from 'mxs/react';

const debouncedQuery = useDebouncedValue(query, { wait: 300 });
```

## Signature

```ts
useDebouncedValue<T>(value: T, options: { wait: number }): T
```

## Behavior

- The first render returns `value` right away.
- Each change restarts the timer.
