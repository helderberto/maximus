import { applyTo } from './applyTo';

type Func<T, R> = (arg: T) => R;

/**
 *
 * Pipe takes HOCs and returns a function that combines them, from the left to the right
 *
 * @category Function
 * @param {...Function} functions - the functions to compose
 * @returns {Function} the composed function
 *
 * @example
 * const increment = x => 1
 * const double = x => x * 2
 * const incrementAndDouble = pipe(increment, double)
 * incrementAndDouble(1) //=> 4
 */
export const pipe =
  <T, R>(...functions: Func<T, R>[]): Func<T, R> =>
  (value: T): R =>
    functions.reduce(applyTo, value);
