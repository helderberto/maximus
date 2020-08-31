/**
 * @description Check if value isn't nullable
 * @param {any} value - Value to check if is defined.
 * @returns {Boolean} - Returns `true` if isn't `null` and `undefined`.
 */
export default function isDefined(value) {
  return typeof value !== 'undefined' && value !== null
}
