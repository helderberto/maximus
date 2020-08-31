import is from '../is'

/**
 * @name isEmpty
 * @category Common Helpers
 * @summary Is the given input empty?
 *
 * @description
 * Checks if the given argument is empty.
 *
 * @param {*} input - the value to check
 * @returns {Boolean} the input is empty
 *
 * @example
 * isEmpty('')
 * //=> true
 *
 * @example
 * isEmpty([0, 1, 2])
 * //=> false
 */
export default function isEmpty(input) {
  if (is(Array, input)) {
    return input.length === 0
  }

  if (is(Date, input)) {
    return false
  }

  if (is(Object, input)) {
    return Object.keys(input).length === 0
  }

  return true
}
