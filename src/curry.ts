type Func = (...args: any[]) => any;

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
export const curry = (fn: Func): Func =>
  function curried(this: any, ...args: any[]): Func {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (this: any, ..._args: any[]): any {
      return curried.apply(this, args.concat(_args));
    };
  };
