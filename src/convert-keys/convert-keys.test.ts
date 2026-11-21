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

  it('never sets the prototype from a `__proto__` key', () => {
    const parsed: unknown = JSON.parse('{ "__proto__": { "is_admin": true }, "user_id": 1 }');
    const converted = convertKeys(parsed, { to: 'camelCase' }) as Record<string, unknown>;
    expect(Object.getPrototypeOf(converted)).toBe(Object.prototype);
    expect(converted).toEqual({ __proto: { isAdmin: true }, userId: 1 });
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

  it('infers the case from the options', () => {
    expectTypeOf(convertKeys(value, { to: 'PascalCase' })).toEqualTypeOf<{
      UserId: number;
      HomeAddress: { StreetName: string; GeoPoint: { LatValue: number } };
      OrderItems: { UnitPrice: number }[];
    }>();
    // @ts-expect-error: 'Title Case' is not a supported case.
    convertKeys(value, { to: 'Title Case' });
  });
});
