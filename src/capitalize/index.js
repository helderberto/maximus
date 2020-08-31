import is from '../is'

/**
 * Capitalize the first letter of a word
 * @param {string} text - The text to be capitalized.
 * @returns {string} Return the capitalized word.
 * @throws {TypeError} Any different type from String throws a TypeError.
 * @example
 * returns 'Hello'
 * capitalize('hElLo')
 */
export default function capitalize(text) {
  if (!is(text)) {
    throw new TypeError('Invalid parameter type.')
  }
  return text.slice(0, 1).toUpperCase() + text.slice(1).toLowerCase()
}
