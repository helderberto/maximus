import { buildPath } from './build-path.js';

describe('buildPath', () => {
  describe('params', () => {
    it('returns a pattern without params unchanged', () => {
      expect(buildPath('/users')).toBe('/users');
    });

    it('fills required params', () => {
      expect(buildPath('/users/:userId/posts/:postId', { params: { userId: '42', postId: '7' } })).toBe(
        '/users/42/posts/7',
      );
    });

    it('fills an optional param when given', () => {
      expect(buildPath('/users/:userId?', { params: { userId: '42' } })).toBe('/users/42');
    });

    it('drops an omitted optional segment without a double slash', () => {
      expect(buildPath('/users/:userId?', { params: {} })).toBe('/users');
      expect(buildPath('/a/:b?/c', { params: {} })).toBe('/a/c');
    });

    it('keeps wildcard slashes and encodes each segment', () => {
      expect(buildPath('/files/*', { params: { '*': 'docs/a b' } })).toBe('/files/docs/a%20b');
    });
  });

  describe('encoding', () => {
    it.each([
      ['a b', 'a%20b'],
      ['a/b', 'a%2Fb'],
      ['café', 'caf%C3%A9'],
      ['a?b#c&d', 'a%3Fb%23c%26d'],
    ])('encodes %s as %s', (value, encoded) => {
      expect(buildPath('/users/:userId', { params: { userId: value } })).toBe(`/users/${encoded}`);
    });
  });

  describe('search', () => {
    it('appends search params', () => {
      expect(buildPath('/users', { search: { tab: 'posts', page: 2 } })).toBe('/users?tab=posts&page=2');
    });

    it('drops undefined values', () => {
      expect(buildPath('/users', { search: { tab: undefined, page: 1 } })).toBe('/users?page=1');
    });

    it('repeats the key for arrays', () => {
      expect(buildPath('/users', { search: { tag: ['a', 'b'] } })).toBe('/users?tag=a&tag=b');
    });

    it('adds no ? for an empty search', () => {
      expect(buildPath('/users', { search: {} })).toBe('/users');
    });

    it('encodes search values', () => {
      expect(buildPath('/users', { search: { q: 'a&b c' } })).toBe('/users?q=a%26b+c');
    });
  });

  describe('types', () => {
    it('infers params from the path pattern', () => {
      expectTypeOf(buildPath<'/users/:userId/posts/:postId?/*'>)
        .parameter(1)
        .exclude<undefined>()
        .toHaveProperty('params')
        .toEqualTypeOf<{ userId: string; postId?: string; '*': string }>();
    });

    it('rejects a missing required param', () => {
      // @ts-expect-error: userId is required by the pattern, so omitting it must not type-check.
      buildPath('/users/:userId', { params: {} });
      // @ts-expect-error: options are required when the pattern has a required param.
      buildPath('/users/:userId');
    });
  });
});
