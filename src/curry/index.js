/**
 * @description Create curried method
 * @param {Function} fn - Function to be curried.
 * @param {any} args - Rest of parameters to be passed to function.
 * @returns {Function} - Returns the curried method with arguments.
 */
export function curry(fn, args = []) {
  return (..._args) =>
    ((rest) => (rest.length >= fn.length ? fn(...rest) : curry(fn, rest)))([
      ...args,
      ..._args,
    ])
}
