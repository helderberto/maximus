import { createTransformer } from './create-transformer';

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

describe('createTransformer exclude', () => {
  it('keeps converted keys the domain does not declare when nothing is excluded', () => {
    const transformUser = createTransformer<UserDto, User>({
      keys: 'camelCase',
      fields: { fullName: (source) => `${source.first_name} ${source.last_name}` },
    });
    expect(Object.keys(transformUser(dto))).toEqual([
      'userId',
      'firstName',
      'lastName',
      'passwordHash',
      'auditLog',
      'fullName',
    ]);
  });

  it('leaves excluded DTO keys out of the result', () => {
    const transformUser = createTransformer<UserDto, User>({
      keys: 'camelCase',
      exclude: ['first_name', 'last_name', 'password_hash', 'audit_log'],
      fields: { fullName: (source) => `${source.first_name} ${source.last_name}` },
    });
    expect(transformUser(dto)).toStrictEqual({ userId: 1, fullName: 'Ada Lovelace' });
    expect(transformUser([dto])).toStrictEqual([{ userId: 1, fullName: 'Ada Lovelace' }]);
  });

  it('never walks excluded values and leaves the DTO untouched', () => {
    const copy = structuredClone(dto);
    const auditLog = {
      get changed_at(): string {
        throw new Error('excluded values must not be read');
      },
    };
    const transformUser = createTransformer<UserDto, User>({
      keys: 'camelCase',
      exclude: ['audit_log'],
      fields: { fullName: (source) => source.first_name },
    });
    expect(() => transformUser({ ...dto, audit_log: [auditLog] })).not.toThrow();
    transformUser(dto);
    expect(dto).toEqual(copy);
  });

  it('accepts only keys the domain does not use', () => {
    // @ts-expect-error: `user_id` converts to `userId`, a domain field, so it cannot be excluded.
    createTransformer<UserDto, User>({
      keys: 'camelCase',
      exclude: ['user_id'],
      fields: { fullName: (source) => source.first_name },
    });
    createTransformer<UserDto, User>({
      keys: 'camelCase',
      // @ts-expect-error: `nickname` is not a DTO key.
      exclude: ['nickname'],
      fields: { fullName: (source) => source.first_name },
    });
    // @ts-expect-error: without `keys`, only `fields` are kept, so there is nothing to exclude.
    createTransformer<UserDto, { id: number }>({ exclude: ['first_name'], fields: { id: 'user_id' } });
  });
});
