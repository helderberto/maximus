import { transformData } from './transform-data';

interface UserDto {
  user_id: number;
  first_name: string;
  last_name: string;
  password_hash: string;
  audit_log: { changed_at: string }[];
}

interface User {
  userId: number;
  fullName: string;
}

const dto: UserDto = {
  user_id: 1,
  first_name: 'Ada',
  last_name: 'Lovelace',
  password_hash: 'x',
  audit_log: [{ changed_at: '2026-01-01' }],
};

describe('transformData exclude', () => {
  it('keeps converted keys the domain does not declare when nothing is excluded', () => {
    const user: User = transformData(dto, {
      keys: 'camelCase',
      fields: { fullName: (source) => `${source.first_name} ${source.last_name}` },
    });
    expect(Object.keys(user)).toEqual(['userId', 'firstName', 'lastName', 'passwordHash', 'auditLog', 'fullName']);
  });

  it('leaves excluded DTO keys out of the result, for one DTO and for arrays', () => {
    const options = {
      keys: 'camelCase',
      exclude: ['first_name', 'last_name', 'password_hash', 'audit_log'],
      fields: { fullName: (source: UserDto) => `${source.first_name} ${source.last_name}` },
    } as const;
    const user: User = transformData(dto, options);
    const users: User[] = transformData([dto], options);
    expect(user).toStrictEqual({ userId: 1, fullName: 'Ada Lovelace' });
    expect(users).toStrictEqual([{ userId: 1, fullName: 'Ada Lovelace' }]);
  });

  it('never walks excluded values and leaves the DTO untouched', () => {
    const copy = structuredClone(dto);
    const throwing = {
      get changed_at(): string {
        throw new Error('excluded values must not be read');
      },
    };
    const transform = (source: UserDto): User =>
      transformData(source, {
        keys: 'camelCase',
        exclude: ['audit_log'],
        fields: { fullName: (item) => item.first_name },
      });
    expect(() => transform({ ...dto, audit_log: [throwing] })).not.toThrow();
    transform(dto);
    expect(dto).toEqual(copy);
  });

  it('accepts only keys the domain does not use', () => {
    // @ts-expect-error: `user_id` converts to `userId`, a domain field, so it cannot be excluded.
    const required: User = transformData(dto, {
      keys: 'camelCase',
      exclude: ['user_id'],
      fields: { fullName: (source) => source.first_name },
    });
    const unknownKey: User = transformData(dto, {
      keys: 'camelCase',
      // @ts-expect-error: `nickname` is not a DTO key.
      exclude: ['nickname'],
      fields: { fullName: (source) => source.first_name },
    });
    // @ts-expect-error: without `keys`, only `fields` are kept, so there is nothing to exclude.
    const pick: { id: number } = transformData(dto, { exclude: ['first_name'], fields: { id: 'user_id' } });
    expect([required, unknownKey, pick]).toHaveLength(3);
  });
});
