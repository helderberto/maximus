import { composeReducer } from '../../utils'

/**
 *
 * Compose takes HOCs and returns a function that combines them from the right to the left
 *
 * @category Function
 * @param {...Function} functions - the functions to compose
 * @returns {Function} the composed function
 *
 * @example
 * const add1 = x => 1
 * const multiply2 = x => x * 2
 * const doubleAndIncrement = compose(add1, multiply2)
 * doubleAndIncrement(1) //=> 3
 */

export function compose(...functions) {
  return function reduceFunctions(value) {
    return functions.reduceRight(composeReducer, value)
  }
}
