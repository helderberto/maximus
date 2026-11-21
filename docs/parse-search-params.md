# parseSearchParams

Parses a query string into a typed object described by a schema.

```ts
import { parseSearchParams } from 'mxs';

parseSearchParams('?q=shoes&page=2&tag=a&tag=b', {
  schema: { q: 'string', page: { type: 'number', default: 1 }, tag: 'string[]' },
});
// => { q: 'shoes', page: 2, tag: ['a', 'b'] }
```

## Signature

```ts
parseSearchParams(search: string | URLSearchParams | URL, options: { schema: SearchParamsSchema }): SearchParamsResult
```

| Field type                 | Result type       | Missing or invalid          |
| -------------------------- | ----------------- | --------------------------- |
| `'string'`                 | `string \| null`  | `null`                      |
| `'number'`                 | `number \| null`  | `null`                      |
| `'boolean'`                | `boolean \| null` | `null`                      |
| `'string[]'`, `'number[]'` | array             | `[]`, invalid items dropped |
| `{ type, default }`        | the scalar type   | `default`                   |

## Behavior

- The result type is inferred from the schema. No generics needed.
- Booleans read `true`, `1` and a bare key as `true`. `false` and `0` are `false`.
- Numbers must be finite. An empty value is invalid.
- Arrays collect every repeated key, in order.
- A default must match its field type. A mismatch is a compile-time error.
