import applyTo from './applyTo';

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
 */
export default function compose<T, R>(...functions: Func<T, R>[]): Func<T, R> {
  return function reduceFunctions(value: T): R {
    return functions.reduceRight(applyTo, value);
  };
}
