# useStorageState

Like `useState`, persisted as JSON in `localStorage` and synced across hooks and tabs.

```ts
import { useStorageState } from 'mxs/react';

const [count, setCount, removeCount] = useStorageState('count', { initialValue: 0 });
setCount((value) => value + 1);

const [theme, setTheme] = useStorageState('theme', {
  initialValue: 'light',
  parse: (value) => (value === 'light' || value === 'dark' ? value : null),
});
// theme: 'light' | 'dark'
```

## Signature

```ts
useStorageState<T>(key: string, options: { initialValue: T; parse?: (value: unknown) => T | null; storage?: Storage }):
  readonly [value: T, setValue: (next: T | ((previous: T) => T)) => void, remove: () => void]
```

| Option         | Description                                                             |
| -------------- | ----------------------------------------------------------------------- |
| `initialValue` | Used when the key is missing, the data is invalid, or on the server.    |
| `parse`        | Validates stored JSON and sets the value type. Return `null` to reject. |
| `storage`      | Any `Storage`, such as `sessionStorage`. Defaults to `localStorage`.    |

## Behavior

- Built on `useSyncExternalStore`. Every hook using the same key re-renders on a change.
- Other tabs sync through the `storage` event.
- Missing, corrupt or rejected data falls back to `initialValue`.
- The server render and hydration use `initialValue`.
- Never throws when storage is blocked or full.
