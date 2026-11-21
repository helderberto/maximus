# AGENTS.md

## Deep modules

Small, clean interface relative to what the module does. Callers need minimal knowledge to use it. Example: Unix file I/O (`open`, `read`, `write`, `close`) hides buffering, caching and disk layout.

A function ships only if it passes all:

- Deletion test: without it, complexity reappears in 2+ real projects.
- Platform-first: no native equivalent in Node 24+ or modern browsers.
- Errors defined out: misuse fails at compile time; "not found" returns `null`, no throw.
- Zero runtime dependencies.

See `docs/adr/0001-deep-modules-platform-first.md`.

## Releases

- Exact dependency versions, no `^` or `~` (`.npmrc` sets `save-prefix=""`).
- Versioning: [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html).
- `CHANGELOG.md`: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Every user-facing change goes under `## [Unreleased]`.
- CI enforces it: a PR changing `src/` must add an `[Unreleased]` entry. A version bump must add a matching `## [x.y.z] - YYYY-MM-DD` section.
- Release: in a PR, run `npm run bump:<patch|minor|major>` and rename `[Unreleased]` to the new version section. Merging to `main` publishes to npm with provenance and tags `vX.Y.Z`. Never tag or publish by hand.

## API design

- Explicit, descriptive names. No Lodash/Ramda naming (`removeDuplicates`, not `uniq`).
- Max 2 parameters. More → one options object.
- Infer types from literals. Callers never write generics.

## Imports and exports

- Named only: `export { buildPath } from './build-path'`.
- No `export *`, `import * as`, or `export default`.
- Relative imports have no extension. A folder import resolves its `index.ts`. Types ship bundled in `dist/index.d.ts`, so consumers on `nodenext` still resolve them.

## File structure

- TypeScript only: every file is `.ts`, configs and scripts included.
- kebab-case for every file and folder.
- One folder per function, test beside implementation:

```
src/is-empty/
  index.ts          # barrel
  is-empty.ts       # implementation
  is-empty.test.ts  # test
```

- Large types → `types.ts`. Constants → `constants.ts`. Same folder.
- No `enum`. Use `as const` objects.
- Tests cover types too (`expectTypeOf`).

## Docs

- New function: add `docs/<name>.md` and a row in `docs/api.md`. Keep the README to one usage example.
- Polish changed docs with `/hb:revise`.
