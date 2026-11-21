# transformData

Transforms a DTO into a domain object, or an array of DTOs into an array of domain objects. It can convert key case (camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE), leave out keys and compute any field. It never mutates the input.

```ts
import { transformData } from 'mxs';

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

const user: User = transformData(userDto, {
  keys: 'camelCase',
  exclude: ['first_name', 'last_name'],
  fields: {
    fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
    createdAt: (dto) => new Date(dto.created_at),
  },
});
```

## Signature

```ts
transformData(input: Dto | Dto[], {
  keys?: 'camelCase' | 'PascalCase' | 'snake_case' | 'kebab-case' | 'CONSTANT_CASE',
  exclude?: (keyof Dto)[],
  fields?: { [field in keyof Domain]: FieldSource },
}): Domain | Domain[]
```

A field source is one of:

| Source                    | Example                                        | Result                      |
| ------------------------- | ---------------------------------------------- | --------------------------- |
| DTO key                   | `userId: 'user_id'`                            | Copies `dto.user_id`.       |
| Function of the whole DTO | `createdAt: (dto) => new Date(dto.created_at)` | Returns the computed value. |

## Types come from the input and the annotation

The DTO type comes from the input. The domain type comes from the annotation on the result, so you write no generics:

```ts
const user: User = transformData(userDto, options);
const users: User[] = transformData(userDtos, options);
```

Without an annotation there is no domain type to check against, so the call fails to compile. An array input needs an array annotation, and one DTO needs one domain object.

## Whole response

With `keys`, every key of the response is converted, nested ones included. `fields` lists only the domain fields the conversion does not already provide with the right type. `userId` and `homeAddress` come from conversion. `fullName` has no DTO key, and `created_at` converts to a string, not a `Date`, so both need a source:

```ts
const user: User = transformData(userDto, {
  keys: 'camelCase',
  fields: {
    fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
    createdAt: (dto) => new Date(dto.created_at),
  },
});
```

## Excluding fields

With `keys`, every converted key stays on the result, even ones the domain type does not declare. In the example above, `firstName` and `lastName` would still be there next to `fullName`. List the DTO keys to leave out in `exclude`, by their original names:

```ts
const user: User = transformData(userDto, {
  keys: 'camelCase',
  exclude: ['first_name', 'last_name'],
  fields: {
    fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
    createdAt: (dto) => new Date(dto.created_at),
  },
});
// { userId, createdAt, homeAddress, fullName }
```

- `exclude` only accepts DTO keys whose converted name is not a domain field. Your editor suggests exactly the keys that would leak, and excluding a field the domain needs fails to compile.
- `fields` still read the original DTO, so a computed field can use a key you exclude.
- Excluded keys are dropped before conversion, so their values are never walked.
- To keep only a few keys of a large DTO, leave out `keys` and list the fields instead.

## Keys that are data

Some objects use their keys as data: locale codes, IDs, slugs. Converting them would change the data, so `en_US` would become `enUs`. Fields read the original DTO, so copy those objects unchanged while the rest is converted:

```ts
const product: Product = transformData(productDto, {
  keys: 'camelCase',
  fields: { translations: 'translations' },
});
// { productId: 1, translations: { en_US: 'Hat', pt_BR: 'Chapéu' } }
```

## Specific fields

Without `keys`, nothing is converted unless a field asks for it, and `fields` must list every domain field. Call [`convertKeys`](convert-keys.md) in a function source to convert the keys of one field only:

```ts
const user: User = transformData(userDto, {
  fields: {
    userId: 'user_id',
    fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
    createdAt: (dto) => new Date(dto.created_at),
    homeAddress: (dto) => convertKeys(dto.home_address, { to: 'camelCase' }),
  },
});
```

## Reusing a transform

Wrap the call in a function with a return annotation. It is plain TypeScript, so it works anywhere a function does:

```ts
const transformUser = (dto: UserDto): User =>
  transformData(dto, {
    keys: 'camelCase',
    exclude: ['first_name', 'last_name'],
    fields: {
      fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
      createdAt: (dto) => new Date(dto.created_at),
    },
  });

userDtos.map(transformUser); // User[]
```

## Nested objects

Call another transform from a function source:

```ts
const transformAddress = (dto: AddressDto): Address =>
  transformData(dto, { fields: { streetName: 'street_name', city: 'city' } });

const user: User = transformData(userDto, {
  fields: {
    userId: 'user_id',
    fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
    createdAt: (dto) => new Date(dto.created_at),
    homeAddress: (dto) => transformAddress(dto.home_address),
  },
});
```

## Requests

Convert the other way to send a domain object to a snake_case API:

```ts
const body: UserInputDto = transformData(userInput, { keys: 'snake_case' });
```

## Behavior

- Missing fields, unknown DTO keys, unknown cases, mismatched types and a missing annotation fail at compile time. A field is checked against the converted type, so `created_at: string` does not fill `createdAt: Date`.
- Keys and functions in `fields` always read the original DTO, before any conversion.
- Without `keys`, DTO keys that `fields` does not name are dropped. With `keys`, every converted key is kept unless it is listed in `exclude`.
- Key conversion follows [`convertKeys`](convert-keys.md): how words split, what is walked, and which key wins a clash.
- Returns a new object and never mutates the input. Values it does not convert are shared by reference.
- The input must be an object or an array of objects. Every array is treated as a list of DTOs.

## TanStack Query

Pass a reusable transform to `select`, or annotate an inline arrow. A function defined at module scope keeps a stable reference, so `select` reruns only when the data changes:

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
  select: (data): User[] => transformData(data, { keys: 'camelCase' }),
});
// users: User[] | undefined
```

## RTK Query

Pass a reusable transform to `transformResponse`. For an inline arrow, type the response and annotate the result, because RTK Query lets `transformResponse` return a promise:

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
      transformResponse: (users: UserDto[]): User[] => users.map(transformUser),
    }),
  }),
});
```
