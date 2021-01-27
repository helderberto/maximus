/**
 * A function that takes multiple arguments and returns a curried method.
 *
 * @category Function
 * @param {Function} fn - the function to curry
 * @returns {Function} the curried method with arguments
 *
 * @example
 * const sum = (a, b, c) => a + b + c
 * const curriedSum = curry(sum)
 * curriedSum(1)(2, 3) //=> 6
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
