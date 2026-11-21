# API reference

Every function is a named export from `mxs`:

```ts
import { buildPath, matchPath, removeDuplicates } from 'mxs';
```

React hooks are named exports from `mxs/react`. They need React 18 or newer:

```ts
import { useStorageState } from 'mxs/react';
```

## Path

| Function                                      | Signature                                  | Description                                                              |
| --------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| [`buildPath`](build-path.md)                  | `buildPath(pattern, { params?, search? })` | Builds a path from a path pattern. Params are inferred from the pattern. |
| [`matchPath`](match-path.md)                  | `matchPath(pattern, pathnameOrUrl)`        | Matches a pathname or URL to typed, decoded params, or `null`.           |
| [`parseSearchParams`](parse-search-params.md) | `parseSearchParams(search, { schema })`    | Parses a query string into a typed object, with defaults and arrays.     |

## Data

| Function                                     | Signature                                                    | Description                                                                                        |
| -------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| [`createTransformer`](create-transformer.md) | `createTransformer<Dto, Domain>({ keys?, depth?, fields? })` | Transforms a DTO into a domain object, converting key case and computing fields, typed end to end. |
| [`convertKeys`](convert-keys.md)             | `convertKeys(value, { to, depth? })`                         | Copies a value with its keys in camelCase, snake_case or another case, typed.                      |

## Arrays

| Function                                   | Signature                          | Description                                                                    |
| ------------------------------------------ | ---------------------------------- | ------------------------------------------------------------------------------ |
| [`removeDuplicates`](remove-duplicates.md) | `removeDuplicates(items, { by? })` | Removes duplicates by a typed key or a selector, keeping the first occurrence. |

## Async

| Function                                        | Signature                                                  | Description                                                    |
| ----------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| [`retry`](retry.md)                             | `retry(fn, { attempts, backoff?, shouldRetry?, signal? })` | Retries an async function with exponential backoff and abort.  |
| [`mapWithConcurrency`](map-with-concurrency.md) | `mapWithConcurrency(items, { limit, fn })`                 | Maps items through an async function with a concurrency cap.   |
| [`dedupeInFlight`](dedupe-in-flight.md)         | `dedupeInFlight(fn, { key? })`                             | Shares one pending promise between concurrent identical calls. |

## Timing

| Function                  | Signature                                   | Description                                                    |
| ------------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| [`debounce`](debounce.md) | `debounce(fn, { wait, leading?, signal? })` | Runs the last call after a quiet period. `cancel` and `flush`. |
| [`throttle`](throttle.md) | `throttle(fn, { wait, signal? })`           | Runs at most once per window. `cancel` and `flush`.            |

## Browser and events

| Function                                        | Signature                                      | Description                                                   |
| ----------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| [`createTypedStorage`](create-typed-storage.md) | `createTypedStorage({ key, parse, storage? })` | Validated JSON storage for one key. Never throws.             |
| [`createTypedEmitter`](create-typed-emitter.md) | `createTypedEmitter<Events>()`                 | Event emitter with names and payloads typed by one event map. |

## Formatting

| Function                                        | Signature                                     | Description                                               |
| ----------------------------------------------- | --------------------------------------------- | --------------------------------------------------------- |
| [`formatRelativeTime`](format-relative-time.md) | `formatRelativeTime(date, { now?, locale? })` | "5 minutes ago", with the unit picked for you, or `null`. |

## React (`mxs/react`)

| Hook                                          | Signature                                                  | Description                                                    |
| --------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| [`useStorageState`](use-storage-state.md)     | `useStorageState(key, { initialValue, parse?, storage? })` | `useState` persisted to storage, synced across hooks and tabs. |
| [`useDebouncedValue`](use-debounced-value.md) | `useDebouncedValue(value, { wait })`                       | Returns the value once it stops changing.                      |
| [`usePrevious`](use-previous.md)              | `usePrevious(value)`                                       | Returns the previous distinct value, or `null`.                |
| [`useMediaQuery`](use-media-query.md)         | `useMediaQuery(query)`                                     | Whether a media query matches. `false` on the server.          |
| [`useEventListener`](use-event-listener.md)   | `useEventListener(target, { type, listener })`             | Typed event listener on a target or ref, removed on unmount.   |
| [`useClickOutside`](use-click-outside.md)     | `useClickOutside(refs, { onClickOutside })`                | Calls a handler on a press outside one or more elements.       |
| [`useInterval`](use-interval.md)              | `useInterval(callback, { delay })`                         | Runs a callback every `delay` ms. `null` pauses it.            |
