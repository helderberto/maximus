# createTypedStorage

Wraps one storage key with JSON serialization and validation.

```ts
import { createTypedStorage } from 'mxs';

const theme = createTypedStorage({
  key: 'theme',
  parse: (value) => (value === 'light' || value === 'dark' ? value : null),
});

theme.set('dark');
theme.get();
// => 'dark'
```

## Signature

```ts
createTypedStorage<T>(options: { key: string; parse: (value: unknown) => T | null; storage?: Storage }): {
  get: () => T | null;
  set: (value: T) => boolean;
  remove: () => void;
}
```

| Option    | Description                                                                               |
| --------- | ----------------------------------------------------------------------------------------- |
| `key`     | The storage key.                                                                          |
| `parse`   | Validates the parsed JSON. Return the value, or `null` to reject it. Sets the value type. |
| `storage` | Any `Storage`. Defaults to `localStorage`, read lazily.                                   |

## Behavior

- Never throws. `get` returns `null` for a missing key, corrupt JSON, a rejected value or unavailable storage.
- `set` returns `false` when the write fails, for example on a full quota.
- Safe to create during SSR. Storage is only touched on `get`, `set` and `remove`.
