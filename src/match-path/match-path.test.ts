import { buildPath } from '../build-path/build-path.js';
import { matchPath } from './match-path.js';

describe('matchPath', () => {
  describe('matching', () => {
    it('returns params for a matching pathname', () => {
      expect(matchPath('/users/:userId/posts/:postId', '/users/42/posts/7')).toEqual({
        params: { userId: '42', postId: '7' },
      });
    });

    it('returns null when the pathname does not match', () => {
      expect(matchPath('/users/:userId', '/posts/42')).toBeNull();
    });

    it('omits an optional param that is absent', () => {
      expect(matchPath('/users/:userId?', '/users')).toEqual({ params: {} });
    });

    it('captures the wildcard', () => {
      expect(matchPath('/files/*', '/files/docs/readme.md')).toEqual({ params: { '*': 'docs/readme.md' } });
    });
  });

  describe('input', () => {
    it.each([
      ['a pathname with search and hash', '/users/42?tab=posts#top'],
      ['a full URL', 'https://example.com/users/42?tab=posts'],
      ['a trailing slash', '/users/42/'],
    ])('accepts %s', (_, input) => {
      expect(matchPath('/users/:userId', input)).toEqual({ params: { userId: '42' } });
    });

    it('is case-sensitive', () => {
      expect(matchPath('/users/:userId', '/Users/42')).toBeNull();
    });

    it('decodes params', () => {
      expect(matchPath('/users/:userId', '/users/caf%C3%A9%20a%2Fb')).toEqual({ params: { userId: 'café a/b' } });
    });
  });

  describe('round trip', () => {
    it('returns the params buildPath was given', () => {
      const params = { userId: 'a b/c', postId: 'é' };
      expect(matchPath('/users/:userId/:postId?', buildPath('/users/:userId/:postId?', { params }))).toEqual({
        params,
      });
    });

    it('returns params without the omitted optional', () => {
      const params = { userId: '42' };
      expect(matchPath('/users/:userId/:postId?', buildPath('/users/:userId/:postId?', { params }))).toEqual({
        params,
      });
    });

    it('returns the wildcard with its slashes', () => {
      const params = { '*': 'docs/a b.md' };
      expect(matchPath('/files/*', buildPath('/files/*', { params }))).toEqual({ params });
    });
  });

  describe('types', () => {
    it('infers params from the path pattern', () => {
      expectTypeOf(matchPath('/users/:userId/posts/:postId?/*', '/')).toEqualTypeOf<{
        params: { userId: string; postId?: string; '*': string };
      } | null>();
    });
  });
});
