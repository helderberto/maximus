import applyTo from './applyTo'

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

export default function compose(...functions) {
  return function reduceFunctions(value) {
    return functions.reduceRight(applyTo, value)
  }
}
