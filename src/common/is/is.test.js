import is from '../is'

describe('maximus.is', () => {
  describe('maximus.is.String', () => {
    test('should ensure the value is a string', () => {
      expect(is.String('any_test')).toBeTruthy()
    })

    test('should ensure the value null returns false', () => {
      expect(is.String(null)).toBeFalsy()
    })

    test('should ensure the value undefined returns false', () => {
      expect(is.String(undefined)).toBeFalsy()
    })
  })
})
