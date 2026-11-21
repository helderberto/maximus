# throttle

Calls a function at most once per `wait` ms.

```ts
import { throttle } from 'mxs';

window.addEventListener('scroll', throttle(updatePosition, { wait: 100 }));
```

## Signature

```ts
throttle<Args>(fn: (...args: Args) => void, options: { wait: number; signal?: AbortSignal }): Throttled<Args>
```

| Option   | Description                                               |
| -------- | --------------------------------------------------------- |
| `wait`   | Minimum time in ms between calls.                         |
| `signal` | Aborting cancels the pending call and ignores later ones. |

## Behavior

- The first call runs immediately.
- Calls during the window are collapsed. The last one runs when the window ends.
- `cancel` drops the pending call. `flush` runs it now.
