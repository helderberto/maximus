# createTransformer

Creates a pure function that transforms a DTO into a domain object, or an array of DTOs into an array of domain objects. It can convert key case (camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE) across the whole response or in specific fields, and lets you compute any field yourself. It never mutates the DTO.

```ts
import { convertKeys, createTransformer } from 'mxs';

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
}): {
  (dto: Dto): Domain;
  (dtos: readonly Dto[]): Domain[];
}
```

A field source is one of:

| Source                    | Example                                        | Result                      |
| ------------------------- | ---------------------------------------------- | --------------------------- |
| DTO key                   | `id: 'user_id'`                                | Copies `dto.user_id`.       |
| Function of the whole DTO | `createdAt: (dto) => new Date(dto.created_at)` | Returns the computed value. |

## Whole response

With `keys`, every key of the response is converted, nested ones included. `fields` lists only the domain fields the conversion does not already provide with the right type:

```ts
createTransformer<UserDto, User>({
  keys: 'camelCase',
  fields: { fullName: (dto) => `${dto.first_name} ${dto.last_name}` },
});
```

## Keys that are data

Some objects use their keys as data: locale codes, IDs, slugs. Converting them would change the data, so `en_US` would become `enUs`. Fields read the original DTO, so copy those objects unchanged while the rest is converted:

```ts
createTransformer<ProductDto, Product>({
  keys: 'camelCase',
  fields: { translations: 'translations' },
});
// { productId: 1, translations: { en_US: 'Hat', pt_BR: 'Chapéu' } }
```

## Specific fields

Without `keys`, nothing is converted unless a field asks for it, and `fields` must list every domain field. Call [`convertKeys`](convert-keys.md) in a function source to convert the keys of one field only:

```ts
createTransformer<UserDto, User>({
  fields: {
    userId: 'user_id',
    fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
    createdAt: (dto) => new Date(dto.created_at),
    homeAddress: (dto) => convertKeys(dto.home_address, { to: 'camelCase' }),
  },
});
```

## Behavior

- Missing fields, unknown DTO keys, unknown cases and mismatched types fail at compile time. A field is checked against the converted type, so `created_at: string` does not fill `createdAt: Date`.
- Keys and functions in `fields` always read the original DTO, before any conversion.
- Without `keys`, DTO keys that `fields` does not name are dropped. With `keys`, every converted key is kept, even ones the domain type does not declare (here `firstName` and `lastName`).
- Key conversion follows [`convertKeys`](convert-keys.md): how words split, what is walked, and which key wins a clash.
- The transformer returns a new object and never mutates the DTO. Values it does not convert are shared by reference. The options are read once, when the transformer is created.
- It takes two generics because types have no literal to infer them from: the DTO comes from the API, the domain type from your app.

## Requests

Convert the other way to send a domain object to a snake_case API:

```ts
const transformUserToDto = createTransformer<UserInput, UserInputDto>({ keys: 'snake_case' });
```

## Arrays

The same transformer takes one DTO or an array of them, and returns the matching type:

```ts
transformUser(userDto); // User
transformUser(userDtos); // User[]
userDtos.map(transformUser); // User[]
```

`Dto` must be an object type, not an array: the transformer maps any array it receives.

## Nested objects

Call another transformer from a function source:

```ts
const transformAddress = createTransformer<AddressDto, Address>({ fields: { street: 'street_name', city: 'city' } });

const transformUser = createTransformer<UserDto, User>({
  keys: 'camelCase',
  fields: { address: (dto) => transformAddress(dto.home_address) },
});
```

## TanStack Query

Pass the transformer to `select`, for one DTO or a list. A transformer made at module scope keeps a stable reference, so `select` reruns only when the data changes:

```ts
const { data } = useQuery({
  queryKey: ['user', id],
  queryFn: (): Promise<UserDto> => fetch(`/api/users/${id}`).then((response) => response.json()),
  select: transformUser,
});
// data: User | undefined

const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: (): Promise<UserDto[]> => fetch('/api/users').then((response) => response.json()),
  select: transformUser,
});
// users: User[] | undefined
```

## RTK Query

Pass the transformer to `transformResponse`. RTK Query types the response as `unknown`, so for a list, type the response in an arrow function:

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
      transformResponse: (users: UserDto[]) => transformUser(users),
    }),
  }),
});
```
