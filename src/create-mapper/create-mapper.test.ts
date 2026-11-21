import { createMapper } from './create-mapper';
import type { FieldMapping } from './types';

interface UserDto {
  user_id: number;
  first_name: string;
  last_name: string;
  email_address: string | null;
  created_at: string;
  nickname?: string;
  address: { street_name: string; city: string };
}

interface Address {
  street: string;
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

const toAddress = createMapper<UserDto['address'], Address>({
  street: 'street_name',
  city: 'city',
});

const toUser = createMapper<UserDto, User>({
  id: 'user_id',
  fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
  email: 'email_address',
  createdAt: (dto) => new Date(dto.created_at),
  nickname: 'nickname',
  address: (dto) => toAddress(dto.address),
});

const dto: UserDto = {
  user_id: 1,
  first_name: 'Ada',
  last_name: 'Lovelace',
  email_address: null,
  created_at: '2026-01-01T00:00:00.000Z',
  address: { street_name: 'Main St', city: 'London' },
};

describe('createMapper', () => {
  it('copies renamed keys and computes fields from the whole DTO', () => {
    expect(toUser(dto)).toEqual({
      id: 1,
      fullName: 'Ada Lovelace',
      email: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      nickname: undefined,
      address: { street: 'Main St', city: 'London' },
    });
  });

  it('drops DTO keys the mapping does not name', () => {
    const toId = createMapper<UserDto, { id: number }>({ id: 'user_id' });
    expect(toId(dto)).toStrictEqual({ id: 1 });
  });

  it('maps arrays through Array.prototype.map', () => {
    expect([dto, { ...dto, user_id: 2 }].map(toUser).map((user) => user.id)).toEqual([1, 2]);
  });

  it('returns a new object and leaves the DTO untouched', () => {
    const copy = structuredClone(dto);
    expect(toUser(dto)).not.toBe(toUser(dto));
    expect(dto).toEqual(copy);
  });

  it('reads the mapping once, at creation', () => {
    const fields: FieldMapping<UserDto, { id: number }> = { id: 'user_id' };
    const toId = createMapper<UserDto, { id: number }>(fields);
    fields.id = () => 99;
    expect(toId(dto)).toEqual({ id: 1 });
  });

  it('types the mapper from the DTO to the domain', () => {
    expectTypeOf(toUser).toEqualTypeOf<(dto: UserDto) => User>();
    createMapper<UserDto, User>({
      id: 'user_id',
      fullName: (source) => {
        expectTypeOf(source).toEqualTypeOf<UserDto>();
        return source.first_name;
      },
      email: 'email_address',
      createdAt: (source) => new Date(source.created_at),
      nickname: (source) => source.nickname,
      address: (source) => toAddress(source.address),
    });
  });

  it('rejects incomplete mappings, unknown keys and mismatched types', () => {
    // @ts-expect-error: `name` has no source, so the mapping must not type-check.
    createMapper<UserDto, { id: number; name: string }>({ id: 'user_id' });
    // @ts-expect-error: `full_name` is not a DTO key.
    createMapper<UserDto, { name: string }>({ name: 'full_name' });
    // @ts-expect-error: `user_id` is a number, not a string.
    createMapper<UserDto, { name: string }>({ name: 'user_id' });
    // @ts-expect-error: `email_address` can be null, so it does not fit a string field.
    createMapper<UserDto, { email: string }>({ email: 'email_address' });
    // @ts-expect-error: `nickname` is optional, so it does not fit a required string field.
    createMapper<UserDto, { nickname: string }>({ nickname: 'nickname' });
    // @ts-expect-error: the computed value is a string, not a Date.
    createMapper<UserDto, { createdAt: Date }>({ createdAt: (source) => source.created_at });
    // @ts-expect-error: `extra` is not a domain field.
    createMapper<UserDto, { id: number }>({ id: 'user_id', extra: 'first_name' });
  });
});
