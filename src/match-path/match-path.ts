import type { PathParams } from '../path-pattern/types';

export interface PathMatch<Pattern extends string> {
  params: PathParams<Pattern>;
}

const WILDCARD_GROUP = '0';

const toPathname = (pathnameOrUrl: string): string => {
  const { pathname } = new URL(pathnameOrUrl, 'http://localhost');
  return pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
};

const toParams = (groups: Readonly<Record<string, string | undefined>>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(groups)
      .filter((entry): entry is [string, string] => entry[1] !== undefined)
      .map(([name, value]) => [name === WILDCARD_GROUP ? '*' : name, decodeURIComponent(value)]),
  );

/**
 * Matches a pathname or URL against a path pattern.
 * Search and hash are ignored, a trailing slash is tolerated, and matching is case-sensitive.
 *
 * @param pattern - the path pattern, e.g. `/users/:userId/posts/:postId?`
 * @param pathnameOrUrl - a pathname such as `req.url`, or a full URL
 * @returns the decoded params, typed from the pattern, or `null` when it does not match
 *
 * @example
 * matchPath('/users/:userId', '/users/42?tab=posts') // => { params: { userId: '42' } }
 * matchPath('/users/:userId', '/posts/42') // => null
 */
export const matchPath = <Pattern extends string>(
  pattern: Pattern,
  pathnameOrUrl: string,
): PathMatch<Pattern> | null => {
  const result = new URLPattern({ pathname: pattern }).exec({ pathname: toPathname(pathnameOrUrl) });
  if (!result) {
    return null;
  }
  // The params shape is guaranteed by URLPattern matching the same pattern the type is inferred from.
  return { params: toParams(result.pathname.groups) as PathParams<Pattern> };
};
