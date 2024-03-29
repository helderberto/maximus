import { curry } from '..';

describe('curry', () => {
  it('should validate curried numbers', () => {
    const sum = (a: number, b: number, c: number) => a + b + c;
    const curriedSum = curry(sum);

    expect(curriedSum(2)(2, 2)).toEqual(6);
  });

  it('should test with more arguments', () => {
    const add = curry((n1: number, n2: number) => n1 + n2);

    expect(add(1, 2, 3)).toEqual(3);
  });
});
