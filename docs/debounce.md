# debounce

Delays calls until `wait` ms pass without a new call, then runs the last one.

```ts
import { debounce } from 'mxs';

const save = debounce((text: string) => api.save(text), { wait: 300 });

save('a');
save('ab');
// => api.save('ab') once, 300ms later

save.flush(); // run the pending call now
save.cancel(); // drop it
```

## Signature

```ts
debounce<Args>(fn: (...args: Args) => void, options: { wait: number; leading?: boolean; signal?: AbortSignal }): Debounced<Args>
```

| Option    | Description                                               |
| --------- | --------------------------------------------------------- |
| `wait`    | Quiet time in ms before the call runs.                    |
| `leading` | Also call on the first call of a burst.                   |
| `signal`  | Aborting cancels the pending call and ignores later ones. |

## Behavior

- With `leading`, a single call runs once, not twice.
- `flush` runs the pending call right away. With nothing pending, it does nothing.
- The returned function keeps the argument types of `fn`.
