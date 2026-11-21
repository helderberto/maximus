# useInterval

Calls a function every `delay` ms. A `null` delay pauses it.

```ts
import { useInterval } from 'mxs/react';

useInterval(() => setSeconds((seconds) => seconds + 1), { delay: isRunning ? 1000 : null });
```

## Signature

```ts
useInterval(callback: () => void, options: { delay: number | null }): void
```

## Behavior

- Changing the callback does not restart the interval. The latest one is called.
- Changing `delay` restarts it.
- Stops on unmount.
