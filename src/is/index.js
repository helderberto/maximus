import curry from '../curry'
import isDefined from '../isDefined'

/**
 * @description Check the value data type
 * @param {Object} targetPrototype - The instanceof object to be checked.
 * @param {any} value - Value to be validated by targetPrototype.
 * @returns {Boolean} - Returns true if value is the instance of targetPrototype.
 */
export default curry((targetPrototype, value) => {
  if (!isDefined(value)) return false

  return (
    value.constructor === targetPrototype || value instanceof targetPrototype
  )
})
