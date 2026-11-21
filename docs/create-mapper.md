# createMapper

Creates a pure function that maps a DTO to a domain object. Each domain field names a DTO key to copy, or a function that computes the value from the whole DTO.

```ts
import { createMapper } from 'mxs';

interface UserDto {
  user_id: number;
  first_name: string;
  last_name: string;
  created_at: string;
}

interface User {
  id: number;
  fullName: string;
  createdAt: Date;
}

const toUser = createMapper<UserDto, User>({
  id: 'user_id',
  fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
  createdAt: (dto) => new Date(dto.created_at),
});

toUser({ user_id: 1, first_name: 'Ada', last_name: 'Lovelace', created_at: '2026-01-01' });
// => { id: 1, fullName: 'Ada Lovelace', createdAt: Date }
```

## Signature

```ts
createMapper<Dto, Domain>(fields: {
  [K in keyof Domain]: keyof Dto | ((dto: Dto) => Domain[K]);
}): (dto: Dto) => Domain
```

## Behavior

- Every domain field needs a source, optional fields included. A missing field fails at compile time.
- A key source must be a DTO key whose value fits the domain field. `string | null` does not fit `string`, and an optional DTO key does not fit a required field.
- A function source receives the typed DTO and must return the domain field's type.
- DTO keys the mapping does not name are dropped.
- The mapper returns a new object and never mutates the DTO. The mapping is read once, when the mapper is created.
- It takes two generics because types have no literal to infer them from: the DTO comes from the API, the domain type from your app.

## Arrays and nested objects

Map arrays with `Array.prototype.map`. Map nested objects with another mapper:

```ts
const toAddress = createMapper<AddressDto, Address>({ street: 'street_name', city: 'city' });

const toUser = createMapper<UserDto, User>({
  id: 'user_id',
  address: (dto) => toAddress(dto.address),
  tags: (dto) => dto.tags.map((tag) => tag.label),
});

users.map(toUser);
```

## TanStack Query

Pass the mapper to `select`. A mapper made at module scope keeps a stable reference, so `select` reruns only when the data changes:

```ts
const { data } = useQuery({
  queryKey: ['user', id],
  queryFn: (): Promise<UserDto> => fetch(`/api/users/${id}`).then((response) => response.json()),
  select: toUser,
});
// data: User | undefined
```

## RTK Query

Pass the mapper to `transformResponse`:

```ts
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (build) => ({
    getUser: build.query<User, number>({
      query: (id) => `users/${id}`,
      transformResponse: toUser,
    }),
    getUsers: build.query<User[], void>({
      query: () => 'users',
      transformResponse: (users: UserDto[]) => users.map(toUser),
    }),
  }),
});
```
