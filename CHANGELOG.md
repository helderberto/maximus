# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `createTransformer<Dto, Domain>({ keys, fields })`: creates a pure function that transforms a DTO into a domain object. It takes one DTO or an array of them, converts key case across the whole response, and checks renamed and computed fields at compile time.
- `convertKeys(value, { to })`: copies a value with its keys in camelCase, PascalCase, snake_case, kebab-case or CONSTANT_CASE. The result type carries the converted keys.

## [1.1.1] - 2026-11-21

### Changed

- The npm description now names the helpers the library ships: typed URLs, retry, debounce, storage and React hooks.
- The README shows a downloads badge and an index of every module, so the npm page lists them too.

## [1.1.0] - 2026-11-21

### Added

- `parseSearchParams(search, { schema })`: parses a query string into a typed object with defaults and arrays.
- `retry(fn, { attempts, backoff, shouldRetry, signal })`: retries an async function with exponential backoff and abort.
- `mapWithConcurrency(items, { limit, fn })`: maps items through an async function with a concurrency cap.
- `dedupeInFlight(fn, { key })`: shares one pending promise between concurrent identical calls.
- `createTypedStorage({ key, parse, storage })`: validated JSON storage for one key that never throws.
- `createTypedEmitter<Events>()`: event emitter typed by one event map.
- `formatRelativeTime(date, { now, locale })`: formats a date relative to now and picks the unit.
- `debounce(fn, { wait, leading, signal })` and `throttle(fn, { wait, signal })`, with `cancel` and `flush`.
- `mxs/react` entry with an optional `react` peer dependency (18 or newer): `useStorageState`, `useDebouncedValue`, `usePrevious`, `useMediaQuery`, `useEventListener`, `useClickOutside` and `useInterval`.

### Changed

- Type declarations ship bundled, one file per entry: `dist/index.d.ts` and `dist/react.d.ts`.

## [1.0.0] - 2026-11-21

### Added

- `matchPath(pattern, pathnameOrUrl)`: matches a pathname or URL to typed, decoded params, or `null`.
- `buildPath(pattern, { params, search })`: builds a path with params inferred from the path pattern.
- `removeDuplicates(items, { by })`: removes duplicates by a typed key or a selector and keeps the first occurrence.

### Changed

- **Breaking:** the package is ESM only (`"type": "module"`). On Node 24+, `require('mxs')` still works.
- **Breaking:** requires Node 24 or newer.

### Removed

- **Breaking:** `applyTo`, `compose`, `curry`, `pipe`, `isEmpty` and `uniq`, deprecated in 0.11.0.
- The UMD browser build.
- The docsify documentation site. Docs now live in `docs/` on GitHub.

## [0.11.0] - 2026-11-21

Tagged but not published to npm. Its deprecations ship as removals in 1.0.0.

### Deprecated

- `applyTo`: call the function directly. Removed in 1.0.
- `compose`: use plain function calls. Removed in 1.0.
- `curry`: use plain function calls or arrow functions. Removed in 1.0.
- `pipe`: use plain function calls. Removed in 1.0.
- `isEmpty`: use a type-specific check (`length`, `size` or `Object.keys`). Removed in 1.0.
- `uniq`: use `removeDuplicates`. Removed in 1.0.

### Fixed

- Publishing now builds `dist` before packing, not after.

Earlier versions: see the [git history](https://github.com/helderberto/maximus/commits/v0.10.1).

[Unreleased]: https://github.com/helderberto/maximus/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/helderberto/maximus/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/helderberto/maximus/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/helderberto/maximus/compare/v0.11.0...v1.0.0
[0.11.0]: https://github.com/helderberto/maximus/compare/v0.10.1...v0.11.0
