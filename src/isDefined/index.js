/**
 * @name isDefined
 * @category Common Helpers
 * @summary Is the given value defined?
 *
 * @description
 * Checks if the given argument isn't null or undefined.
 *
 * @param {*} value - the value to check
 * @returns {Boolean} true if value isn't null or undefined
 *
 * @example
 * isDefined('maximus')
 * //=> true
 *
 * @example
 * isDefined(null)
 * //=> false
 */
export function isDefined(value) {
  return typeof value !== 'undefined' && value !== null
}
