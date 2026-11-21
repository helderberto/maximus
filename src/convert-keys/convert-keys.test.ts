import { convertKey, convertKeys } from './convert-keys';
import type { ConvertKey, ConvertKeys } from './types';

describe('convertKey', () => {
  it.each([
    ['first_name', 'camelCase', 'firstName'],
    ['first_name', 'PascalCase', 'FirstName'],
    ['firstName', 'snake_case', 'first_name'],
    ['FirstName', 'kebab-case', 'first-name'],
    ['first-name', 'CONSTANT_CASE', 'FIRST_NAME'],
    ['FIRST_NAME', 'camelCase', 'firstName'],
    ['first name', 'camelCase', 'firstName'],
    ['userID', 'snake_case', 'user_id'],
    ['address_line2', 'camelCase', 'addressLine2'],
    ['line2Total', 'snake_case', 'line2_total'],
    ['_id', 'camelCase', '_id'],
    ['__typename', 'PascalCase', '__Typename'],
    ['id', 'CONSTANT_CASE', 'ID'],
  ] as const)('converts %s to %s', (...[key, keyCase, expected]) => {
    expect(convertKey(key, keyCase)).toBe(expected);
  });

  it('infers the same keys it produces', () => {
    expectTypeOf<ConvertKey<'first_name', 'camelCase'>>().toEqualTypeOf<'firstName'>();
    expectTypeOf<ConvertKey<'first_name', 'PascalCase'>>().toEqualTypeOf<'FirstName'>();
    expectTypeOf<ConvertKey<'firstName', 'snake_case'>>().toEqualTypeOf<'first_name'>();
    expectTypeOf<ConvertKey<'FirstName', 'kebab-case'>>().toEqualTypeOf<'first-name'>();
    expectTypeOf<ConvertKey<'first-name', 'CONSTANT_CASE'>>().toEqualTypeOf<'FIRST_NAME'>();
    expectTypeOf<ConvertKey<'FIRST_NAME', 'camelCase'>>().toEqualTypeOf<'firstName'>();
    expectTypeOf<ConvertKey<'userID', 'snake_case'>>().toEqualTypeOf<'user_id'>();
    expectTypeOf<ConvertKey<'address_line2', 'camelCase'>>().toEqualTypeOf<'addressLine2'>();
    expectTypeOf<ConvertKey<'line2Total', 'snake_case'>>().toEqualTypeOf<'line2_total'>();
    expectTypeOf<ConvertKey<'_id', 'camelCase'>>().toEqualTypeOf<'_id'>();
    expectTypeOf<ConvertKey<'__typename', 'PascalCase'>>().toEqualTypeOf<'__Typename'>();
    expectTypeOf<ConvertKey<string, 'camelCase'>>().toEqualTypeOf<string>();
  });
});

describe('convertKeys', () => {
  const value = {
    user_id: 1,
    home_address: { street_name: 'Main', geo_point: { lat_value: 1 } },
    order_items: [{ unit_price: 2 }],
  };

  it('converts every level by default, objects inside arrays included', () => {
    expect(convertKeys(value, { to: 'camelCase' })).toEqual({
      userId: 1,
      homeAddress: { streetName: 'Main', geoPoint: { latValue: 1 } },
      orderItems: [{ unitPrice: 2 }],
    });
  });

  it('stops after `depth` object levels and shares the levels below', () => {
    const shallow = convertKeys(value, { to: 'camelCase', depth: 1 });
    expect(shallow).toEqual({
      userId: 1,
      homeAddress: { street_name: 'Main', geo_point: { lat_value: 1 } },
      orderItems: [{ unit_price: 2 }],
    });
    expect(shallow.homeAddress).toBe(value.home_address);
    expect(convertKeys(value, { to: 'camelCase', depth: 2 })).toEqual({
      userId: 1,
      homeAddress: { streetName: 'Main', geoPoint: { lat_value: 1 } },
      orderItems: [{ unitPrice: 2 }],
    });
  });

  it('does not count arrays as a level', () => {
    expect(convertKeys([{ user_id: 1, home_address: { street_name: 'Main' } }], { to: 'camelCase', depth: 1 })).toEqual(
      [{ userId: 1, homeAddress: { street_name: 'Main' } }],
    );
  });

  it('returns a new value and never mutates the input', () => {
    const copy = structuredClone(value);
    expect(convertKeys(value, { to: 'snake_case' })).not.toBe(value);
    expect(value).toEqual(copy);
  });

  it('passes through primitives, null and non-plain objects', () => {
    const date = new Date();
    const map = new Map([['some_key', 1]]);
    expect(convertKeys({ created_at: date, lookup: map, deleted_at: null }, { to: 'camelCase' })).toEqual({
      createdAt: date,
      lookup: map,
      deletedAt: null,
    });
    expect(convertKeys('first_name', { to: 'camelCase' })).toBe('first_name');
  });

  it('converts objects with a null prototype', () => {
    const nullPrototype = Object.assign(Object.create(null) as object, { first_name: 'Ada' });
    expect(convertKeys(nullPrototype, { to: 'camelCase' })).toEqual({ firstName: 'Ada' });
  });

  it('types nested objects, arrays, optional keys and dates', () => {
    interface Dto {
      user_id: number;
      created_at: Date;
      nick_name?: string;
      home_address: { street_name: string } | null;
      order_items: { unit_price: number }[];
    }
    expectTypeOf<ConvertKeys<Dto, 'camelCase'>>().toEqualTypeOf<{
      userId: number;
      createdAt: Date;
      nickName?: string;
      homeAddress: { streetName: string } | null;
      orderItems: { unitPrice: number }[];
    }>();
  });

  it('infers the case and depth from the options', () => {
    expectTypeOf(convertKeys(value, { to: 'camelCase', depth: 1 })).toEqualTypeOf<{
      userId: number;
      homeAddress: { street_name: string; geo_point: { lat_value: number } };
      orderItems: { unit_price: number }[];
    }>();
    expectTypeOf(convertKeys(value, { to: 'PascalCase', depth: 2 })).toEqualTypeOf<{
      UserId: number;
      HomeAddress: { StreetName: string; GeoPoint: { lat_value: number } };
      OrderItems: { UnitPrice: number }[];
    }>();
    // @ts-expect-error: depth goes from 1 to 5. Omit it to convert every level.
    convertKeys(value, { to: 'camelCase', depth: 6 });
    // @ts-expect-error: 'Title Case' is not a supported case.
    convertKeys(value, { to: 'Title Case' });
  });
});
