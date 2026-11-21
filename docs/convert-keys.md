# convertKeys

Returns a copy of a value with its keys in another case. The result type carries the converted keys.

```ts
import { convertKeys } from 'mxs';

const user = convertKeys({ user_id: 1, home_address: { street_name: 'Main' } }, { to: 'camelCase' });
// => { userId: 1, homeAddress: { streetName: 'Main' } }
// user: { userId: number; homeAddress: { streetName: string } }
```

## Signature

```ts
convertKeys(value, { to: 'camelCase' | 'PascalCase' | 'snake_case' | 'kebab-case' | 'CONSTANT_CASE' });
```

## Behavior

- Converts every level: nested objects and objects inside arrays.
- Words split on `_`, `-`, spaces, and before a capital that follows a lowercase letter or digit: `userID` becomes `user_id`, `address_line2` becomes `addressLine2`. Leading underscores stay: `_id` stays `_id`.
- Only plain objects and arrays are walked. Dates, maps, sets, class instances and primitives pass through unchanged.
- If two keys convert to the same name, the last one wins.
- Never mutates the input.

## Request bodies

Convert a domain object before sending it to a snake_case API:

```ts
await fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify(convertKeys(userInput, { to: 'snake_case' })),
});
```

To map a whole response to a domain type, with computed fields, use [`createTransformer`](create-transformer.md).
