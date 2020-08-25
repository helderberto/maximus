/**
 * This methods capitalize the first letter of a text
 * @method capitalize
 * @param {string} str
 * @return {string}
 * @example
 * const text = capitalize('hElLo')
 * console.log(text); // => 'Hello'
 */
export default function capitalize(str) {
  // console.log(str.toLowerCase().chartAt(0).toUpperCase())
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}
