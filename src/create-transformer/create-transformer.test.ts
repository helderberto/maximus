import { convertKeys } from '@/convert-keys';
import { createTransformer } from './create-transformer';

interface UserDto {
  user_id: number;
  first_name: string;
  last_name: string;
  email_address: string | null;
  created_at: string;
  nickname?: string;
  home_address: { street_name: string; city: string };
}

interface Address {
  streetName: string;
  city: string;
}

interface User {
  id: number;
  fullName: string;
  email: string | null;
  createdAt: Date;
  nickname?: string;
  address: Address;
}

const dto: UserDto = {
  user_id: 1,
  first_name: 'Ada',
  last_name: 'Lovelace',
  email_address: null,
  created_at: '2026-01-01T00:00:00.000Z',
  home_address: { street_name: 'Main St', city: 'London' },
};

describe('createTransformer', () => {
  describe('with fields only', () => {
    const transformUser = createTransformer<UserDto, User>({
      fields: {
        id: 'user_id',
        fullName: (source) => `${source.first_name} ${source.last_name}`,
        email: 'email_address',
        createdAt: (source) => new Date(source.created_at),
        nickname: 'nickname',
        address: (source) => convertKeys(source.home_address, { to: 'camelCase' }),
      },
    });

    it('copies keys, converts the keys of one field and computes fields', () => {
      expect(transformUser(dto)).toStrictEqual({
        id: 1,
        fullName: 'Ada Lovelace',
        email: null,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        nickname: undefined,
        address: { streetName: 'Main St', city: 'London' },
      });
    });

    it('drops DTO keys the fields do not name', () => {
      const transformId = createTransformer<UserDto, { id: number }>({ fields: { id: 'user_id' } });
      expect(transformId(dto)).toStrictEqual({ id: 1 });
    });

    it('works with Array.prototype.map and leaves the DTO untouched', () => {
      const copy = structuredClone(dto);
      expect([dto, { ...dto, user_id: 2 }].map(transformUser).map((user) => user.id)).toEqual([1, 2]);
      expect(dto).toEqual(copy);
    });

    it('reads the fields once, at creation', () => {
      const fields = { id: 'user_id' as const };
      const transformId = createTransformer<UserDto, { id: number }>({ fields });
      Object.assign(fields, { id: 'first_name' });
      expect(transformId(dto)).toEqual({ id: 1 });
    });

    it('types the transformer and the DTO passed to computed fields', () => {
      expectTypeOf(transformUser).toEqualTypeOf<(dto: UserDto) => User>();
      createTransformer<UserDto, { name: string }>({
        fields: {
          name: (source) => {
            expectTypeOf(source).toEqualTypeOf<UserDto>();
            return source.first_name;
          },
        },
      });
    });

    it('rejects incomplete fields, unknown keys and mismatched types', () => {
      // @ts-expect-error: `name` has no source.
      createTransformer<UserDto, { id: number; name: string }>({ fields: { id: 'user_id' } });
      // @ts-expect-error: `full_name` is not a DTO key.
      createTransformer<UserDto, { name: string }>({ fields: { name: 'full_name' } });
      // @ts-expect-error: `user_id` is a number, not a string.
      createTransformer<UserDto, { name: string }>({ fields: { name: 'user_id' } });
      // @ts-expect-error: `email_address` can be null, so it does not fit a string field.
      createTransformer<UserDto, { email: string }>({ fields: { email: 'email_address' } });
      // @ts-expect-error: `nickname` is optional, so it does not fit a required field.
      createTransformer<UserDto, { nickname: string }>({ fields: { nickname: 'nickname' } });
      // @ts-expect-error: the computed value is a string, not a Date.
      createTransformer<UserDto, { createdAt: Date }>({ fields: { createdAt: (source) => source.created_at } });
      createTransformer<UserDto, { address: Address }>({
        // @ts-expect-error: snake_case keys do not fit `Address`.
        fields: { address: (source) => convertKeys(source.home_address, { to: 'snake_case' }) },
      });
      // @ts-expect-error: `extra` is not a domain field.
      createTransformer<UserDto, { id: number }>({ fields: { id: 'user_id', extra: 'first_name' } });
    });
  });

  describe('with keys', () => {
    interface CamelUser {
      userId: number;
      firstName: string;
      homeAddress: Address;
    }

    it('converts every key of the response, nested ones included', () => {
      const transformUser = createTransformer<UserDto, CamelUser>({ keys: 'camelCase' });
      expect(transformUser(dto)).toEqual({
        userId: 1,
        firstName: 'Ada',
        lastName: 'Lovelace',
        emailAddress: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        homeAddress: { streetName: 'Main St', city: 'London' },
      });
    });

    it('converts domain objects back to snake_case DTOs', () => {
      const transformToDto = createTransformer<Address, UserDto['home_address']>({ keys: 'snake_case' });
      expect(transformToDto({ streetName: 'Main St', city: 'London' })).toEqual({
        street_name: 'Main St',
        city: 'London',
      });
    });

    it('applies fields on top of the converted response', () => {
      const transformUser = createTransformer<UserDto, User>({
        keys: 'camelCase',
        fields: {
          id: 'user_id',
          fullName: (source) => `${source.first_name} ${source.last_name}`,
          email: 'email_address',
          createdAt: (source) => new Date(source.created_at),
          address: (source) => convertKeys(source.home_address, { to: 'camelCase' }),
        },
      });
      expect(transformUser(dto)).toMatchObject({
        id: 1,
        fullName: 'Ada Lovelace',
        email: null,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        address: { streetName: 'Main St', city: 'London' },
      });
    });

    it('converts only the first `depth` levels', () => {
      interface ShallowUser {
        userId: number;
        homeAddress: UserDto['home_address'];
      }
      const transformUser = createTransformer<UserDto, ShallowUser>({ keys: 'camelCase', depth: 1 });
      const user = transformUser(dto);
      expect(user.homeAddress).toEqual({ street_name: 'Main St', city: 'London' });
      expect(user.homeAddress).toBe(dto.home_address);
    });

    it('checks the domain type against the chosen depth', () => {
      // @ts-expect-error: with depth 1, `homeAddress` keeps `street_name`, so it does not fit `Address`.
      createTransformer<UserDto, CamelUser>({ keys: 'camelCase', depth: 1 });
      createTransformer<UserDto, CamelUser>({ keys: 'camelCase', depth: 2 });
      // @ts-expect-error: depth needs keys.
      createTransformer<UserDto, { id: number }>({ depth: 1, fields: { id: 'user_id' } });
      // @ts-expect-error: depth goes from 1 to 5.
      createTransformer<UserDto, CamelUser>({ keys: 'camelCase', depth: 6 });
    });

    it('requires fields only for what conversion does not provide', () => {
      createTransformer<UserDto, CamelUser & { fullName: string }>({
        keys: 'camelCase',
        fields: { fullName: (source) => source.first_name },
      });
      // @ts-expect-error: `fullName` is not a converted key, so it needs a source.
      createTransformer<UserDto, CamelUser & { fullName: string }>({ keys: 'camelCase' });
      // @ts-expect-error: `createdAt` converts to a string, so a Date field needs a source.
      createTransformer<UserDto, { createdAt: Date }>({ keys: 'camelCase' });
      // @ts-expect-error: snake_case keeps `user_id`, so `userId` needs a source.
      createTransformer<UserDto, { userId: number }>({ keys: 'snake_case' });
      // @ts-expect-error: 'Title Case' is not a supported case.
      createTransformer<UserDto, object>({ keys: 'Title Case' });
    });
  });
});
