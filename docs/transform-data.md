# transformData

Transforms a DTO into a domain object, or an array of DTOs into an array of domain objects. It can convert key case (camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE), leave out keys and compute any field. It never mutates the input.

## DTO and domain types

- **DTO** (data transfer object): the shape the API sends, usually snake_case, with dates as strings and fields your app does not need. You do not control it.
- **Domain type**: the shape your app works with, named and typed for its use. Components, hooks and state use only this.

`transformData` is the one place that turns the first into the second, so API details never leak into the rest of the app:

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
transformData<Dto, Domain>(dto: Dto | Dto[], {
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

The DTO type comes from the input. The domain type comes from the annotation on the result, so you usually write no generics:

```ts
const user: User = transformData(userDto, options);
const users: User[] = transformData(userDtos, options);
```

When a type cannot be inferred, pass both generics instead. This is the case for an `any` input, such as the result of `response.json()`:

```ts
const users = transformData<UserDto[], User[]>(await response.json(), { keys: 'camelCase' });
```

Without either, the call fails to compile and the error names both fixes. An array of DTOs pairs with an array result, and one DTO with one domain object.

## Usage

Each example uses this reusable transform:

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
```

### fetch

`response.json()` returns `any`, so type the DTO first, or pass both generics. With an untyped `any` input there is nothing to check against, so `transformData` fails to compile:

```ts
const response = await fetch(`/api/users/${id}`);
const dto: UserDto = await response.json();
const user = transformUser(dto);

// Or, inline:
const user = transformData<UserDto, User>(await response.json(), { keys: 'camelCase' });
```

### axios

Pass the DTO type to the request, then transform `data`:

```ts
const { data } = await axios.get<UserDto[]>('/api/users');
const users = data.map(transformUser);
```

### TanStack Query

Pass the transform to `select`. The cache keeps the DTO, and components get the domain type. A function defined at module scope keeps a stable reference, so `select` reruns only when the data changes:

```ts
const { data: user } = useQuery({
  queryKey: ['user', id],
  queryFn: async (): Promise<UserDto> => (await fetch(`/api/users/${id}`)).json(),
  select: transformUser,
});
// user: User | undefined

const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: async (): Promise<UserDto[]> => (await fetch('/api/users')).json(),
  select: (dtos) => dtos.map(transformUser),
});
// users: User[] | undefined
```

### RTK Query

Pass the transform to `transformResponse`. For a list, type the response:

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
      transformResponse: (dtos: UserDto[]) => dtos.map(transformUser),
    }),
  }),
});
```

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

- Missing fields, unknown DTO keys, unknown cases and mismatched types fail at compile time. So does a call where neither the input, the annotation nor generics give the types. A field is checked against the converted type, so `created_at: string` does not fill `createdAt: Date`.
- Keys and functions in `fields` always read the original DTO, before any conversion.
- Without `keys`, DTO keys that `fields` does not name are dropped. With `keys`, every converted key is kept unless it is listed in `exclude`.
- Key conversion follows [`convertKeys`](convert-keys.md): how words split, what is walked, and which key wins a clash.
- Returns a new object and never mutates the input. Values it does not convert are shared by reference.
- The input must be an object or an array of objects. Every array is treated as a list of DTOs.
