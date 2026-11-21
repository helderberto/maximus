import { applyTo } from './applyTo';

type Func<T, R> = (arg: T) => R;

/**
 *
 * Compose takes HOCs and returns a function that combines them from the right to the left
 *
 * @category Function
 * @param {...Function} functions - the functions to compose
 * @returns {Function} the composed function
 *
 * @example
 * const increment = x => 1
 * const double = x => x * 2
 * const doubleAndIncrement = compose(increment, double)
 * doubleAndIncrement(1) //=> 3
 *
 * @deprecated Removed in 1.0. Use plain function calls: `f(g(x))`.
 */
export const compose =
  <T, R>(...functions: Func<T, R>[]): Func<T, R> =>
  (value: T): R =>
    functions.reduceRight(applyTo, value);
