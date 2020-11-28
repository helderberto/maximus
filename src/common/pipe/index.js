import { composeReducer } from '../../utils'

/**
 *
 * Pipe takes HOCs and returns a function that combines them, from the left to the right
 *
 * @category Function
 * @param {...Function} functions - the functions to compose
 * @returns {Function} the composed function
 *
 * @example
 * const add1 = x => 1
 * const multiply2 = x => x * 2
 * const incrementAndDouble = compose(add1, multiply2)
 * incrementAndDouble(1) //=> 4
 */

export function pipe(...functions) {
  return function reduceFunctions(value) {
    return functions.reduce(composeReducer, value)
  }
}
