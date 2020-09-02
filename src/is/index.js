import { curry, isDefined } from '../index'

/**
 * @name is
 * @category Common Helpers
 * @summary Is the given value instace of the target prototype?
 *
 * @description
 * Checks if the given argument is from the correct type.
 *
 * @param {Object} targetPrototype - the prototype to check
 * @param {*} value - the value to check
 * @returns {Boolean} the value is with the correct type
 *
 * @example
 * is(String, 'maximus')
 * //=> true
 *
 * @example
 * is(Array, {})
 * //=> false
 */
export const is = curry((targetPrototype, value) => {
  if (!isDefined(value)) return false

  return (
    value.constructor === targetPrototype || value instanceof targetPrototype
  )
})
