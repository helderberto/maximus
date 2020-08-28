import is from '../is'

describe('maximus.is', () => {
  describe('maximus.is.String', () => {
    test('should ensure the value is a string', () => {
      expect(is.string('any_test')).toBeTruthy()
    })

    test('should ensure the value null returns false', () => {
      expect(is.string(null)).toBeFalsy()
    })

    test('should ensure the value undefined returns false', () => {
      expect(is.string(undefined)).toBeFalsy()
    })
  })

  describe('maximus.is.array', () => {
    test('should ensure the value is an Array', () => {
      expect(is.array([])).toBeTruthy()
    })

    test('given an invalid array', () => {
      expect(is.array(null)).toBeFalsy()
    })

    test('given an invalid array', () => {
      expect(is.array(undefined)).toBeFalsy()
    })

    test('given an invalid array', () => {
      expect(is.array()).toBeFalsy()
    })

    test('given an invalid array', () => {
      expect(is.array('')).toBeFalsy()
    })

    test('given an invalid array', () => {
      expect(is.array('[]')).toBeFalsy()
    })
  })

  describe('maximus.is.object', () => {
    test('should ensure the value is an object', () => {
      expect(is.object({})).toBeTruthy()
    })

    test('given an invalid object', () => {
      expect(is.object(undefined)).toBeFalsy()
    })

    test('given an invalid object', () => {
      expect(is.object(null)).toBeFalsy()
    })

    test('given an invalid object', () => {
      expect(is.object()).toBeFalsy()
    })
  })
})
