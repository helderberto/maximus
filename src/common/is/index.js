/**
 * @description Validate if str is a String.
 * @param {string} str - Value to be validate.
 * @return {boolean} - Returns true if it's a String.
 */
export const isString = (str) =>
  (str && typeof str === 'string') || str instanceof String
