# createTransformer

Creates a pure function that transforms a DTO into a domain object. It can convert key case (camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE) across the whole response or in specific fields, and lets you compute any field yourself.

```ts
import { createTransformer } from 'mxs';

interface UserDto {
  user_id: number;
  first_name: string;
  last_name: string;
  created_at: string;
  home_address: { street_name: string; city: string };
}

interface User {
  userId: number;
  fullName: string;
  createdAt: Date;
  homeAddress: { streetName: string; city: string };
}

const transformUser = createTransformer<UserDto, User>({
  keys: 'camelCase',
  fields: {
    fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
    createdAt: (dto) => new Date(dto.created_at),
  },
});
```

## Signature

```ts
createTransformer<Dto, Domain>({
  keys?: 'camelCase' | 'PascalCase' | 'snake_case' | 'kebab-case' | 'CONSTANT_CASE',
  fields?: { [field in keyof Domain]: FieldSource },
}): (dto: Dto) => Domain
```

A field source is one of:

| Source                      | Example                                                   | Result                                                               |
| --------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| DTO key                     | `id: 'user_id'`                                           | Copies `dto.user_id`.                                                |
| DTO key with converted keys | `address: { from: 'home_address', keys: 'camelCase' }`    | Copies `dto.home_address` with camelCase keys, nested ones included. |
| Function of the whole DTO   | `fullName: (dto) => dto.first_name + ' ' + dto.last_name` | Returns the computed value.                                          |

## Whole response or specific fields

With `keys`, every key of the response is converted, nested ones included. `fields` lists only the domain fields the conversion does not already provide with the right type:

```ts
createTransformer<UserDto, User>({
  keys: 'camelCase',
  fields: { fullName: (dto) => `${dto.first_name} ${dto.last_name}` },
});
```

Without `keys`, nothing is converted unless a field asks for it, and `fields` must list every domain field. Use `{ from, keys }` to convert the keys of one field only:

```ts
createTransformer<UserDto, User>({
  fields: {
    userId: 'user_id',
    fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
    createdAt: (dto) => new Date(dto.created_at),
    homeAddress: { from: 'home_address', keys: 'camelCase' },
  },
});
```

## Behavior

- Missing fields, unknown DTO keys, unknown cases and mismatched types fail at compile time. A field is checked against the converted type, so `created_at: string` does not fill `createdAt: Date`.
- Keys and functions in `fields` always read the original DTO, before any conversion.
- Without `keys`, DTO keys that `fields` does not name are dropped. With `keys`, every converted key is kept, even ones the domain type does not declare (here `firstName` and `lastName`).
- Words split on `_`, `-`, spaces, and before a capital that follows a lowercase letter or digit: `userID` becomes `user_id`, `address_line2` becomes `addressLine2`. Leading underscores stay: `_id` stays `_id`.
- Conversion walks plain objects and arrays. Dates, maps, sets and class instances pass through unchanged.
- If two keys convert to the same name, the last one wins.
- The transformer returns a new object and never mutates the DTO. The options are read once, when the transformer is created.
- It takes two generics because types have no literal to infer them from: the DTO comes from the API, the domain type from your app.

## Requests

Convert the other way to send a domain object to a snake_case API:

```ts
const transformUserToDto = createTransformer<UserInput, UserInputDto>({ keys: 'snake_case' });
```

## Arrays and nested objects

Transform arrays with `Array.prototype.map`. For nested objects, call another transformer from a function source:

```ts
const transformAddress = createTransformer<AddressDto, Address>({ fields: { street: 'street_name', city: 'city' } });

const transformUser = createTransformer<UserDto, User>({
  keys: 'camelCase',
  fields: { address: (dto) => transformAddress(dto.home_address) },
});

users.map(transformUser);
```

## TanStack Query

Pass the transformer to `select`. A transformer made at module scope keeps a stable reference, so `select` reruns only when the data changes:

```ts
const { data } = useQuery({
  queryKey: ['user', id],
  queryFn: (): Promise<UserDto> => fetch(`/api/users/${id}`).then((response) => response.json()),
  select: transformUser,
});
// data: User | undefined
```

## RTK Query

Pass the transformer to `transformResponse`:

```ts
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (build) => ({
    getUser: build.query<User, number>({
      query: (id) => `users/${id}`,
      transformResponse: transformUser,
    }),
    getUsers: build.query<User[], void>({
      query: () => 'users',
      transformResponse: (users: UserDto[]) => users.map(transformUser),
    }),
  }),
});
```
