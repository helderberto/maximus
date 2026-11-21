<div align="center">
  <h1>⚔️ Maximus</h1>

  <p>Deep, strongly typed modules for Node and React projects</p>

  <p><a href="#install">Install</a> • <a href="#modules">Modules</a> • <a href="CHANGELOG.md">Changelog</a> • <a href="#contribute">Contribute</a></p>

  <div style="display: flex; margin-bottom: 20px; justify-content: center;">
    <a style="margin: 0 2px;" href="https://github.com/helderberto/maximus/actions/workflows/ci.yml">
      <img src="https://github.com/helderberto/maximus/actions/workflows/ci.yml/badge.svg" alt="ci badge">
    </a>
    <a style="margin: 0 2px;" href="https://npmjs.com/package/mxs">
      <img src="https://img.shields.io/npm/v/mxs.svg" alt="version badge">
    </a>
    <a style="margin: 0 2px;" href="https://github.com/helderberto/maximus/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/mxs.svg" alt="license badge">
    </a>
  </div>

  <img src="https://raw.githubusercontent.com/helderberto/maximus/main/banner.jpg" alt="Maximus Banner" />
</div>

## Why Maximus?

Maximus is not another Lodash. Modern JavaScript already covers most of it.

Each module hides real complexity behind a small interface:

- **Platform-first:** nothing that Node 24+ or modern browsers already provide.
- **Types do the work:** types are inferred from literals, so misuse fails at compile time.
- **No surprises:** "no match" returns `null` instead of throwing. Inputs are never mutated.
- **Zero runtime dependencies.** ESM only and tree-shakable.

## Install

```sh
npm i mxs
```

Requires Node 24 or newer. On Node, `require('mxs')` also works.

## Modules

### [buildPath](docs/build-path.md)

Builds a path from a path pattern. Params are inferred from the pattern.

```ts
import { buildPath } from 'mxs';

buildPath('/users/:userId/posts/:postId?', {
  params: { userId: '42' },
  search: { tab: 'comments' },
});
// => '/users/42/posts?tab=comments'
```

### [matchPath](docs/match-path.md)

Matches a pathname or URL to typed, decoded params, or `null`.

```ts
import { matchPath } from 'mxs';

matchPath('/users/:userId', '/users/42?tab=posts');
// => { params: { userId: '42' } }
```

### [removeDuplicates](docs/remove-duplicates.md)

Removes duplicates by a typed key or a selector, keeping the first occurrence.

```ts
import { removeDuplicates } from 'mxs';

removeDuplicates(users, { by: 'id' });
```

## Contribute

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Read [AGENTS.md](AGENTS.md) for the project rules, and add a [CHANGELOG.md](CHANGELOG.md) entry under `[Unreleased]`.

## License

[MIT License](LICENSE) © Maximus
