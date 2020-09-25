/**
 * @name curry
 * @category Common Helpers
 * @summary Create curried method.
 *
 * @description
 * Create curried method.
 *
 * @param {Function} fn - the function to curry
 * @param {Array} args - the rest of arguments
 * @returns {Function} the curried method with arguments
 *
 * @example
 * const sum = (a, b, c) => a + b + c
 * const curriedSum = curry(sum)
 * curriedSum(1)(2, 3)
 * //=> 6
 */
export function curry(fn) {}
