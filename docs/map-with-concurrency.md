# mapWithConcurrency

Maps items through an async function with a cap on how many calls run at once.

```ts
import { mapWithConcurrency } from 'mxs';

const pages = await mapWithConcurrency(urls, {
  limit: 4,
  fn: (url) => fetch(url).then((response) => response.text()),
});
```

## Signature

```ts
mapWithConcurrency<T, R>(items: readonly T[], options: { limit: number; fn: (item: T, index: number) => Promise<R> }): Promise<R[]>
```

| Option  | Description                                           |
| ------- | ----------------------------------------------------- |
| `limit` | Maximum calls in flight. A value below 1 counts as 1. |
| `fn`    | Maps one item. Receives the item and its index.       |

## Behavior

- Results keep input order, whatever order the calls finish in.
- The first rejection rejects the whole call. No new items start after it.
- The input array is never mutated.
