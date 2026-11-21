import type { HasRequiredParams, PathParams } from '@/path-pattern/types';

type SearchValue = string | number | boolean;

export type Search = Readonly<Record<string, SearchValue | readonly SearchValue[] | undefined>>;

export type BuildPathOptions<Pattern extends string> = { search?: Search } & (HasRequiredParams<Pattern> extends true
  ? { params: PathParams<Pattern> }
  : { params?: PathParams<Pattern> });

type BuildPathArgs<Pattern extends string> =
  HasRequiredParams<Pattern> extends true
    ? [options: BuildPathOptions<Pattern>]
    : [options?: BuildPathOptions<Pattern>];

const encodeWildcard = (value: string): string => value.split('/').map(encodeURIComponent).join('/');

const fillSegment = (segment: string, params: Readonly<Record<string, string | undefined>>): string[] => {
  if (segment === '*') {
    return [encodeWildcard(params['*'] ?? '')];
  }
  if (!segment.startsWith(':')) {
    return [segment];
  }
  const value = params[segment.slice(1).replace(/\?$/, '')];
  return value === undefined ? [] : [encodeURIComponent(value)];
};

const buildSearch = (search: Search): string => {
  const searchParams = new URLSearchParams();
  Object.entries(search).forEach(([key, value]) => {
    [value ?? []].flat().forEach((item) => searchParams.append(key, String(item)));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

/**
 * Builds a path from a path pattern, filling params and appending search.
 * Params are inferred from the pattern: `:name` is required, `:name?` optional, `*` the wildcard.
 *
 * @param pattern - the path pattern, e.g. `/users/:userId/posts/:postId?`
 * @param options - `params` fills the pattern; `search` is serialized with `URLSearchParams`
 *
 * @example
 * buildPath('/users/:userId', { params: { userId: '42' }, search: { tab: 'posts' } })
 * // => '/users/42?tab=posts'
 */
export const buildPath = <Pattern extends string>(pattern: Pattern, ...[options]: BuildPathArgs<Pattern>): string => {
  const params: Readonly<Record<string, string | undefined>> = options?.params ?? {};
  const pathname = pattern
    .split('/')
    .flatMap((segment) => fillSegment(segment, params))
    .join('/');
  return `${pathname}${buildSearch(options?.search ?? {})}`;
};
