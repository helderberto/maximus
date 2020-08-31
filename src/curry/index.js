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
export default function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    }
    return function (..._args) {
      return curried.apply(this, args.concat(_args))
    }
  }
}
