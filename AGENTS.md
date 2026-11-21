# AGENTS.md

## Deep modules

Small, clean interface relative to what the module does. Callers need minimal knowledge to use it. Example: Unix file I/O (`open`, `read`, `write`, `close`) hides buffering, caching and disk layout.

A function ships only if it passes all:

- Deletion test: without it, complexity reappears in 2+ real projects.
- Platform-first: no native equivalent in Node 24+ or modern browsers.
- Errors defined out: misuse fails at compile time; "not found" returns `null`, no throw.
- Zero runtime dependencies.

See `docs/adr/0001-deep-modules-platform-first.md`.

## Tooling

- Run tools through npm scripts (`npm run release`, `npm run commitlint`), never `npx`. Missing a script? Add it to `package.json`.

## Releases

- Exact dependency versions, no `^` or `~` (`.npmrc` sets `save-prefix=""`).
- Versioning: [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html).
- Atomic [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). commitlint enforces them. A squash merge takes the PR title, so the title follows them too.
- [semantic-release](https://github.com/semantic-release/semantic-release) releases every push to `main` from the commit types: `feat` is minor, `fix` patch, and `!` or a `BREAKING CHANGE:` footer major.
- `docs`, `refactor`, `perf`, `style`, `build` cut a patch release. `chore`, `ci`, `test` don't.
- semantic-release owns `version` and `CHANGELOG.md`, commits them as `chore(release): x.y.z`, publishes to npm with provenance and creates the GitHub release. Never edit, tag or publish by hand.

## API design

- Explicit, descriptive names. No Lodash/Ramda naming (`removeDuplicates`, not `uniq`).
- Max 2 parameters. More → one options object.
- Infer types from values, so callers usually write no generics. When no value carries the result type, infer it from the caller's annotation: `const user: User = transformData(dto, options)`.
- Generics are the fallback when nothing can be inferred: an event map (`createTypedEmitter<Events>()`), or an `any` input (`transformData<UserDto, User>(await response.json(), options)`). When inference fails, the compile error names the fix.
- Never mutate input. Return a new value, so callers can share inputs, cache them and pass them to React or query caches safely. Parts the function leaves unchanged may be shared by reference.

## Imports and exports

- Named only: `export { buildPath } from './build-path'`.
- No `export *`, `import * as`, or `export default`.
- Cross-folder imports use the `@/` alias for `src/` (`@/path-pattern/types`), never `../`. ESLint enforces it.
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

- React hooks live in `src/react/<hook>/` and ship from `mxs/react` (`src/react.ts`). Hook tests start with `// @vitest-environment happy-dom`.
- `interface` for object shapes. `type` only for unions, conditional, mapped or function types.
- Large types → `types.ts`. Constants → `constants.ts`. Same folder.
- No `enum`. Use `as const` objects.
- Tests cover types too (`expectTypeOf`).

## Docs

- New function: add `docs/<name>.md` and a row in `docs/api.md`. Keep the README to one usage example.
- Polish changed docs with `/hb:revise`.
