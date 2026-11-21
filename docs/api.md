# API reference

Every function is a named export from `mxs`:

```ts
import { buildPath, matchPath, removeDuplicates } from 'mxs';
```

## Path

| Function                     | Signature                                  | Description                                                              |
| ---------------------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| [`buildPath`](build-path.md) | `buildPath(pattern, { params?, search? })` | Builds a path from a path pattern. Params are inferred from the pattern. |
| [`matchPath`](match-path.md) | `matchPath(pattern, pathnameOrUrl)`        | Matches a pathname or URL to typed, decoded params, or `null`.           |

## Arrays

| Function                                   | Signature                          | Description                                                                    |
| ------------------------------------------ | ---------------------------------- | ------------------------------------------------------------------------------ |
| [`removeDuplicates`](remove-duplicates.md) | `removeDuplicates(items, { by? })` | Removes duplicates by a typed key or a selector, keeping the first occurrence. |
