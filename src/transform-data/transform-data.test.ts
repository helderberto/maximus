import { convertKeys } from '@/convert-keys';
import { transformData } from './transform-data';

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

interface CamelUser {
  userId: number;
  firstName: string;
  homeAddress: Address;
}

const dto: UserDto = {
  user_id: 1,
  first_name: 'Ada',
  last_name: 'Lovelace',
  email_address: null,
  created_at: '2026-01-01T00:00:00.000Z',
  home_address: { street_name: 'Main St', city: 'London' },
};

const toUser = (source: UserDto): User =>
  transformData(source, {
    fields: {
      id: 'user_id',
      fullName: (item) => `${item.first_name} ${item.last_name}`,
      email: 'email_address',
      createdAt: (item) => new Date(item.created_at),
      nickname: 'nickname',
      address: (item) => convertKeys(item.home_address, { to: 'camelCase' }),
    },
  });

describe('transformData', () => {
  describe('with fields only', () => {
    it('copies keys, converts the keys of one field and computes fields', () => {
      expect(toUser(dto)).toStrictEqual({
        id: 1,
        fullName: 'Ada Lovelace',
        email: null,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        nickname: undefined,
        address: { streetName: 'Main St', city: 'London' },
      });
    });

    it('drops DTO keys the fields do not name and leaves the DTO untouched', () => {
      const copy = structuredClone(dto);
      const result: { id: number } = transformData(dto, { fields: { id: 'user_id' } });
      expect(result).toStrictEqual({ id: 1 });
      expect(dto).toEqual(copy);
    });

    it('types the DTO passed to computed fields', () => {
      const result: { name: string } = transformData(dto, {
        fields: {
          name: (source) => {
            expectTypeOf(source).toEqualTypeOf<UserDto>();
            return source.first_name;
          },
        },
      });
      expect(result).toEqual({ name: 'Ada' });
    });

    it('rejects incomplete fields, unknown keys and mismatched types', () => {
      // @ts-expect-error: `name` has no source.
      const missing: { id: number; name: string } = transformData(dto, { fields: { id: 'user_id' } });
      // @ts-expect-error: `full_name` is not a DTO key.
      const unknownKey: { name: string } = transformData(dto, { fields: { name: 'full_name' } });
      // @ts-expect-error: `user_id` is a number, not a string.
      const wrongType: { name: string } = transformData(dto, { fields: { name: 'user_id' } });
      // @ts-expect-error: `email_address` can be null, so it does not fit a string field.
      const nullable: { email: string } = transformData(dto, { fields: { email: 'email_address' } });
      // @ts-expect-error: `nickname` is optional, so it does not fit a required field.
      const optional: { nickname: string } = transformData(dto, { fields: { nickname: 'nickname' } });
      const computed: { createdAt: Date } = transformData(dto, {
        // @ts-expect-error: the computed value is a string, not a Date.
        fields: { createdAt: (source) => source.created_at },
      });
      // @ts-expect-error: `extra` is not a domain field.
      const extra: { id: number } = transformData(dto, { fields: { id: 'user_id', extra: 'first_name' } });
      expect([missing, unknownKey, wrongType, nullable, optional, computed, extra]).toHaveLength(7);
    });
  });

  describe('with keys', () => {
    it('converts every key of the response, nested ones included', () => {
      const user: CamelUser = transformData(dto, { keys: 'camelCase' });
      expect(user).toEqual({
        userId: 1,
        firstName: 'Ada',
        lastName: 'Lovelace',
        emailAddress: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        homeAddress: { streetName: 'Main St', city: 'London' },
      });
    });

    it('converts domain objects back to snake_case DTOs', () => {
      const address: Address = { streetName: 'Main St', city: 'London' };
      const addressDto: UserDto['home_address'] = transformData(address, { keys: 'snake_case' });
      expect(addressDto).toEqual({ street_name: 'Main St', city: 'London' });
    });

    it('applies fields on top of the converted response', () => {
      const user: User = transformData(dto, {
        keys: 'camelCase',
        fields: {
          id: 'user_id',
          fullName: (source) => `${source.first_name} ${source.last_name}`,
          email: 'email_address',
          createdAt: (source) => new Date(source.created_at),
          address: (source) => convertKeys(source.home_address, { to: 'camelCase' }),
        },
      });
      expect(user).toMatchObject({ id: 1, fullName: 'Ada Lovelace', email: null, address: { streetName: 'Main St' } });
    });

    it('copies a field unchanged when its keys are data, not field names', () => {
      const productDto = { product_id: 1, translations: { en_US: 'Hat', pt_BR: 'Chapéu' } as Record<string, string> };
      const product: { productId: number; translations: Record<string, string> } = transformData(productDto, {
        keys: 'camelCase',
        fields: { translations: 'translations' },
      });
      expect(product).toEqual({ productId: 1, translations: { en_US: 'Hat', pt_BR: 'Chapéu' } });
    });

    it('requires fields only for what conversion does not provide', () => {
      const withField: CamelUser & { fullName: string } = transformData(dto, {
        keys: 'camelCase',
        fields: { fullName: (source) => source.first_name },
      });
      // @ts-expect-error: `fullName` is not a converted key, so it needs a source.
      const noSource: CamelUser & { fullName: string } = transformData(dto, { keys: 'camelCase' });
      // @ts-expect-error: `createdAt` converts to a string, so a Date field needs a source.
      const notDate: { createdAt: Date } = transformData(dto, { keys: 'camelCase' });
      // @ts-expect-error: snake_case keeps `user_id`, so `userId` needs a source.
      const snake: { userId: number } = transformData(dto, { keys: 'snake_case' });
      // @ts-expect-error: 'Title Case' is not a supported case.
      const title: object = transformData(dto, { keys: 'Title Case' });
      expect([withField, noSource, notDate, snake, title]).toHaveLength(5);
    });
  });

  it('requires a result annotation that matches the input', () => {
    // @ts-expect-error: without an annotation there is no domain type to check the options against.
    const unannotated = transformData(dto, { keys: 'camelCase' });
    // @ts-expect-error: one DTO cannot be annotated as an array result.
    const mismatched: CamelUser[] = transformData(dto, { keys: 'camelCase' });
    expect([unannotated, mismatched]).toHaveLength(2);
  });
});
