<div align="center">
  <h1>⚔️ Maximus</h1>

  <p>The typed helpers every Node and React project rewrites: typed URLs, retry, debounce, storage and React hooks. Zero dependencies, ESM.</p>

  <p><a href="#install">Install</a> • <a href="docs/api.md">API</a> • <a href="CHANGELOG.md">Changelog</a> • <a href="#contribute">Contribute</a></p>

  <p>
    <a href="https://github.com/helderberto/maximus/actions/workflows/ci.yml"><img src="https://github.com/helderberto/maximus/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
    <a href="https://npmjs.com/package/mxs"><img src="https://img.shields.io/npm/v/mxs.svg" alt="npm version"></a>
    <a href="https://npmjs.com/package/mxs"><img src="https://img.shields.io/npm/dm/mxs.svg" alt="npm downloads per month"></a>
    <a href="https://github.com/helderberto/maximus/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/mxs.svg" alt="MIT license"></a>
  </p>

  <br>

  <p><img src="https://raw.githubusercontent.com/helderberto/maximus/main/banner.jpg" alt="Maximus banner" /></p>
</div>

## Why Maximus?

Maximus is not another Lodash. Modern JavaScript already covers most of it.

Maximus covers the rest: the helpers every project rewrites, each hiding real complexity behind a small interface.

- **Platform-first:** nothing that Node 24+ or modern browsers already provide.
- **Types do the work:** types are inferred from literals, so misuse fails at compile time.
- **No surprises:** "no match" returns `null` instead of throwing. Inputs are never mutated.
- **Zero runtime dependencies:** ESM only and tree-shakable. Import one function, ship one function.

## Install

```sh
npm i mxs
```

Requires Node 24 or newer. On Node, `require('mxs')` also works.

React hooks live in `mxs/react` and need React 18 or newer. React is an optional peer dependency.

## Usage

```ts
import { buildPath, matchPath } from 'mxs';

buildPath('/users/:userId', { params: { userId: '42' } });
// => '/users/42'

matchPath('/users/:userId', '/users/42?tab=posts');
// => { params: { userId: '42' } }
```

## What's inside

| Area                | Modules                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Paths and URLs      | [`buildPath`](docs/build-path.md), [`matchPath`](docs/match-path.md), [`parseSearchParams`](docs/parse-search-params.md)                                                                                                                                                                                                       |
| Async               | [`retry`](docs/retry.md), [`mapWithConcurrency`](docs/map-with-concurrency.md), [`dedupeInFlight`](docs/dedupe-in-flight.md)                                                                                                                                                                                                   |
| Timing              | [`debounce`](docs/debounce.md), [`throttle`](docs/throttle.md)                                                                                                                                                                                                                                                                 |
| Storage and events  | [`createTypedStorage`](docs/create-typed-storage.md), [`createTypedEmitter`](docs/create-typed-emitter.md)                                                                                                                                                                                                                     |
| Data and formatting | [`transformData`](docs/transform-data.md), [`convertKeys`](docs/convert-keys.md), [`removeDuplicates`](docs/remove-duplicates.md), [`formatRelativeTime`](docs/format-relative-time.md)                                                                                                                                        |
| React hooks         | [`useStorageState`](docs/use-storage-state.md), [`useDebouncedValue`](docs/use-debounced-value.md), [`usePrevious`](docs/use-previous.md), [`useMediaQuery`](docs/use-media-query.md), [`useEventListener`](docs/use-event-listener.md), [`useClickOutside`](docs/use-click-outside.md), [`useInterval`](docs/use-interval.md) |

Signatures and behavior for each one are in the [API reference](docs/api.md).

## Contribute

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Read [AGENTS.md](AGENTS.md) for the project rules, and add a [CHANGELOG.md](CHANGELOG.md) entry under `[Unreleased]`.

## License

[MIT License](LICENSE) © Helder Burato Berto
