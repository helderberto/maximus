import { removeDuplicates } from './remove-duplicates.js';

interface User {
  id: number;
  name: string;
}

describe('removeDuplicates', () => {
  it('removes duplicate primitives', () => {
    expect(removeDuplicates([1, 2, 1, 3, 2])).toEqual([1, 2, 3]);
  });

  it('removes duplicates by key, keeping the first occurrence', () => {
    const users: User[] = [
      { id: 1, name: 'first' },
      { id: 2, name: 'other' },
      { id: 1, name: 'last' },
    ];
    expect(removeDuplicates(users, { by: 'id' })).toEqual([
      { id: 1, name: 'first' },
      { id: 2, name: 'other' },
    ]);
  });

  it('removes duplicates by selector', () => {
    const words = ['Apple', 'apple', 'Banana'];
    expect(removeDuplicates(words, { by: (word) => word.toLowerCase() })).toEqual(['Apple', 'Banana']);
  });

  it('treats falsy keys as normal values', () => {
    const items = [{ key: 0 }, { key: '' }, { key: 0 }, { key: 1 }, { key: '' }];
    expect(removeDuplicates(items, { by: 'key' })).toEqual([{ key: 0 }, { key: '' }, { key: 1 }]);
  });

  it('does not mutate the input', () => {
    const items = [1, 1, 2];
    removeDuplicates(items);
    expect(items).toEqual([1, 1, 2]);
  });

  it('infers the item type', () => {
    expectTypeOf(removeDuplicates([{ id: 1, name: 'a' }], { by: 'id' })).toEqualTypeOf<
      { id: number; name: string }[]
    >();
  });

  it('accepts only keys of the item type', () => {
    const users: User[] = [];
    // @ts-expect-error: 'email' is not a key of User, so the call must not type-check.
    removeDuplicates(users, { by: 'email' });
    expectTypeOf(removeDuplicates(users, { by: 'name' })).toEqualTypeOf<User[]>();
  });
});
