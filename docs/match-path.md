# matchPath

Matches a pathname or URL against a path pattern. It returns typed, decoded params, or `null` when it doesn't match.

```ts
import { matchPath } from 'mxs';

matchPath('/users/:userId', '/users/42?tab=posts');
// => { params: { userId: '42' } }

matchPath('/files/*', 'https://example.com/files/docs/a%20b.md');
// => { params: { '*': 'docs/a b.md' } }

matchPath('/users/:userId', '/posts/42');
// => null
```

In a Node handler, pass `req.url` directly:

```ts
const match = matchPath('/users/:userId', req.url);
if (match) {
  match.params.userId; // string
}
```

## Signature

```ts
matchPath(pattern, pathnameOrUrl): { params } | null
```

Params are inferred from the [path pattern](./build-path.md#path-pattern): `:name` is required, `:name?` is optional, and `*` is the wildcard.

## Behavior

- Accepts a pathname, a pathname with search and hash, or a full URL. Search and hash are ignored.
- A trailing slash still matches: `/users/42/` matches `/users/:userId`.
- Matching is case-sensitive.
- Params are decoded with `decodeURIComponent`.
- An optional param that is absent is left out of `params`.
- Search isn't parsed. Use `URLSearchParams` for that.
- `matchPath(pattern, buildPath(pattern, { params }))` returns the same `params`.

Built on the native [`URLPattern`](https://developer.mozilla.org/docs/Web/API/URLPattern), available in Node 24+ and modern browsers.
