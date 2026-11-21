# buildPath

Builds a path from a path pattern. It fills params, encodes them, and appends search.

```ts
import { buildPath } from 'mxs';

buildPath('/users/:userId/posts/:postId?', {
  params: { userId: '42' },
  search: { tab: 'comments' },
});
// => '/users/42/posts?tab=comments'

buildPath('/files/*', { params: { '*': 'docs/a b.md' } });
// => '/files/docs/a%20b.md'

buildPath('/users');
// => '/users'
```

## Signature

```ts
buildPath(pattern, options?): string
```

| Option   | Description                                                                        |
| -------- | ---------------------------------------------------------------------------------- |
| `params` | Values for the pattern's segments. Required when the pattern has a required param. |
| `search` | An object serialized to the query string with `URLSearchParams`.                   |

## Path pattern

| Segment  | Meaning                                       | Param type          |
| -------- | --------------------------------------------- | ------------------- |
| `:name`  | required                                      | `string`            |
| `:name?` | optional; its segment is dropped when omitted | `string` (optional) |
| `*`      | wildcard; keeps its slashes                   | `string`, as `'*'`  |

Params are inferred from the pattern. A missing required param is a compile-time error:

```ts
buildPath('/users/:userId', { params: {} });
// Type error: property 'userId' is missing
```

## Behavior

- Each param is encoded with `encodeURIComponent`. A `/` inside a param becomes `%2F`.
- The wildcard is encoded segment by segment, so its slashes are kept.
- Search: `undefined` values are dropped, arrays repeat the key, and an empty object adds no `?`.
