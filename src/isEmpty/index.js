import { is } from '../is'

/**
 * @description Check if the value isn't empty
 * @param {any} input - The parameter to be cheched if isn't empty.
 * @returns {Boolean} - Returns true if it isn't empty.
 */
export function isEmpty(input) {
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
