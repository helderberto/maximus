import { curry } from '../index'

/**
 * @description Check if value isn't nullable
 * @param {any} value - Value to check if is defined.
 * @returns {Boolean} - Returns `true` if isn't `null` and `undefined`.
 */
export function isDefined(value) {
  return typeof value !== 'undefined' && value !== null
}

/**
 * @description Check the value data type
 * @param {Object} targetPrototype - The instanceof object to be checked.
 * @param {any} value - Value to be validated by targetPrototype.
 * @returns {Boolean} - Returns true if value is the instance of targetPrototype.
 */
export function is(targetPrototype, value) {
  if (arguments.length === 1) {
    return curry(is, arguments)
  }

  if (!isDefined(value)) return false

  return (
    value.constructor === targetPrototype || value instanceof targetPrototype
  )
}
