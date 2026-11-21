# removeDuplicates

Returns a new array without duplicates, keeping the first occurrence.

```ts
import { removeDuplicates } from 'mxs';

removeDuplicates([1, 2, 1, 3]);
// => [1, 2, 3]

removeDuplicates(users, { by: 'id' });
// => one user per id, the first one seen

removeDuplicates(words, { by: (word) => word.toLowerCase() });
// => case-insensitive
```

## Signature

```ts
removeDuplicates<T>(items: readonly T[], options?: { by: keyof T | ((item: T) => unknown) }): T[]
```

| Option | Description                                                                                              |
| ------ | -------------------------------------------------------------------------------------------------------- |
| `by`   | The comparison value: a key of the item type, or a selector function. Omit it to compare items directly. |

## Behavior

- Values are compared with `Set` semantics (`SameValueZero`).
- Falsy keys like `0` and `''` are ordinary values. They are never dropped.
- The input array is never mutated.
- `by` accepts only keys of the item type. Any other key is a compile-time error.
