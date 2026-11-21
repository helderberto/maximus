# Glossary

## Design

**Deep module**: a function whose interface is small relative to the behavior it hides.
_Avoid_: helper, util, utility.

**Deletion test**: imagine deleting the module. If its complexity would reappear in 2+ real projects, it earns its place.

**Platform-first**: never ship what Node 24+ or modern browsers already provide.
_Avoid_: polyfill, shim.

## Data

**DTO**: the shape of data as an API sends it, usually snake_case and serialized (dates as strings).
_Avoid_: response, payload, raw.

**Domain object**: the shape the app works with, named and typed for its use.
_Avoid_: model, entity, view model.

**Transformer**: a pure function from a DTO to a domain object, made by `createTransformer`.
_Avoid_: mapper, adapter, serializer.

**Key case**: how a key joins its words: `camelCase`, `PascalCase`, `snake_case`, `kebab-case` or `CONSTANT_CASE`.
_Avoid_: naming convention, casing style.

**Depth**: how many object levels get their keys converted. Arrays do not count as a level.
_Avoid_: level, nesting.

## Path

**Path pattern**: a route string with segments `:name` (required), `:name?` (optional) and `*` (wildcard). Example: `/users/:userId/posts/:postId?`.
_Avoid_: route, template, path template.

**Params**: values for a path pattern's segments. Their type is inferred from the pattern.
_Avoid_: path params, variables, args.

**Wildcard**: the `*` segment. It matches the rest of the pathname, captured as `params['*']`.
_Avoid_: splat, catch-all.

**Search**: an object serialized to the query string with `URLSearchParams`. `undefined` values are dropped; arrays repeat the key.
_Avoid_: query, query params, qs.

**Pathname**: the path part of a URL, with no search or hash. Example: `/users/42`.
_Avoid_: url, path (when the search is excluded).
