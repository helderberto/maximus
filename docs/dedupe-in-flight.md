# dedupeInFlight

Wraps an async function so concurrent identical calls share one pending promise.

```ts
import { dedupeInFlight } from 'mxs';

const fetchUser = dedupeInFlight((id: string) => fetch(`/users/${id}`).then((response) => response.json()));

await Promise.all([fetchUser('1'), fetchUser('1')]);
// => one request
```

## Signature

```ts
dedupeInFlight<Args, R>(fn: (...args: Args) => Promise<R>, options?: { key: (...args: Args) => string }): (...args: Args) => Promise<R>
```

| Option | Description                                                                    |
| ------ | ------------------------------------------------------------------------------ |
| `key`  | Derives the dedupe key from the arguments. Defaults to `JSON.stringify(args)`. |

## Behavior

- Nothing is cached. Once the promise settles, the next call runs `fn` again.
- A rejection is shared by every waiting caller, then cleared.
- The wrapper keeps the exact signature of `fn`.
