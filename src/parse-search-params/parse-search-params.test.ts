import { parseSearchParams } from './parse-search-params';

describe('parseSearchParams', () => {
  it('coerces scalar fields', () => {
    const schema = { q: 'string', page: 'number', debug: 'boolean' } as const;
    expect(parseSearchParams('?q=shoes&page=2&debug=true', { schema })).toEqual({ q: 'shoes', page: 2, debug: true });
  });

  it('returns null for missing or invalid scalars', () => {
    const schema = { q: 'string', page: 'number', debug: 'boolean' } as const;
    expect(parseSearchParams('page=abc&debug=maybe', { schema })).toEqual({ q: null, page: null, debug: null });
  });

  it('applies defaults for missing or invalid values', () => {
    const schema = { page: { type: 'number', default: 1 }, sort: { type: 'string', default: 'name' } } as const;
    expect(parseSearchParams('page=nope', { schema })).toEqual({ page: 1, sort: 'name' });
  });

  it('collects repeated keys into arrays and drops invalid items', () => {
    const schema = { tag: 'string[]', id: 'number[]' } as const;
    expect(parseSearchParams('tag=a&tag=b&id=1&id=x&id=3', { schema })).toEqual({ tag: ['a', 'b'], id: [1, 3] });
  });

  it('returns empty arrays for missing array fields', () => {
    expect(parseSearchParams('', { schema: { tag: 'string[]' } })).toEqual({ tag: [] });
  });

  it('reads booleans from 1, 0, false and a bare key', () => {
    const schema = { a: 'boolean', b: 'boolean', c: 'boolean', d: 'boolean' } as const;
    expect(parseSearchParams('a=1&b=0&c=false&d', { schema })).toEqual({ a: true, b: false, c: false, d: true });
  });

  it('accepts URLSearchParams and URL', () => {
    const schema = { q: 'string' } as const;
    expect(parseSearchParams(new URLSearchParams('q=x'), { schema })).toEqual({ q: 'x' });
    expect(parseSearchParams(new URL('https://a.dev/p?q=y'), { schema })).toEqual({ q: 'y' });
  });

  it('decodes values', () => {
    expect(parseSearchParams('q=hello%20world', { schema: { q: 'string' } })).toEqual({ q: 'hello world' });
  });

  it('infers the result type from the schema', () => {
    const result = parseSearchParams('', {
      schema: { q: 'string', page: { type: 'number', default: 1 }, tag: 'string[]', on: 'boolean' },
    });
    expectTypeOf(result).toEqualTypeOf<{ q: string | null; page: number; tag: string[]; on: boolean | null }>();
  });
});
