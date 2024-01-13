import curry from './curry';

type Func<T, R> = (arg: T) => R;

/**
 *
 * Takes a value and applies it to a function
 *
 * @category Function
 * @param {*} value - the value that will be applied
 * @param {Function} function - the function that will receive the value
 * @returns {*} the return of applied function with the value
 *
 * @example
 * const increment = x => 1
 * applyTo(1, increment) // => 2
 */

const applyTo = curry(<T, R>(value: T, fn: Func<T, R>): R => {
  return fn(value);
});

export default applyTo;
