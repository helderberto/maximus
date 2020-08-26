/**
 * This methods capitalize the first letter of a text
 * @method capitalize
 * @param {string} str
 * @return {string}
 * @example
 * const text = capitalize('hElLo')
 * console.log(text); // => 'Hello'
 */
export default function capitalize(str = '') {
  if (!str) {
    throw new Error("Can't capitalize an empty string")
  }
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}
