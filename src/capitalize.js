import { isString } from './is'

/**
 * @description Capitalize first letter of a text.
 * @param {string} text - The text to be capitalized.
 * @return {string} The capitalized text.
 * @example
 * capitalize('hElLo')
 * returns 'Hello'
 */
export default function capitalize(text = '') {
  if (!isString(text)) {
    throw new TypeError('Invalid parameter type.')
  }
  return text.slice(0, 1).toUpperCase() + text.slice(1).toLowerCase()
}
