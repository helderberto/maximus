/**
 * @description Validate if str is a String.
 * @param {string} str - Value to be validate.
 * @return {boolean} - Returns true if it's a String.
 */
function String(str) {
  return str && typeof str === 'string'
}

export default {
  String,
}
