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

/**
 * @description Check if the given parameter is an object.
 * @param {Object} obj - The parameter to be validated.
 * @returns {Boolean} - Returns true if it's an object.
 */
function object(obj) {
  return obj === Object(obj)
}

export default {
  string,
  array,
  object,
}
