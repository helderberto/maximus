import applyTo from './applyTo';

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
export default function pipe(...functions) {
  return function reduceFunctions(value) {
    return functions.reduce(applyTo, value);
  };
}
