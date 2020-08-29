/**
 * @description Check the value data type
 * @param {Object} targetPrototype - The instanceof object to be checked.
 * @param {any} value - Value to be validated by targetPrototype.
 * @returns {Boolean} - Returns true if value is the instance of targetPrototype.
 */
export function is(targetPrototype, value) {
  if (arguments.length === 1) {
    return (_value) => is(targetPrototype, _value)
  }

  return (
    (value != null && value.constructor === targetPrototype) ||
    value instanceof targetPrototype
  )
}
