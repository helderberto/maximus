/**
 * @description Check if type is a String
 * @param {String} str - Value to be validate.
 * @return {Boolean} - Returns true if it's a String.
 */
function string(str) {
  return str && typeof str === 'string'
}

/**
 * @description Check if value is an Array
 * @param {Array} arr - Value to be validate.
 * @returns {Boolean} - Returns true if it's an Array.
 */
function array(arr) {
  return Array.isArray(arr)
}

export default {
  string,
  array,
}
