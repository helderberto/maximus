import is from '../is'
import faker from 'faker'

describe('maximus.is', () => {
  describe('maximus.is.String', () => {
    test('should ensure the value is a string', () => {
      expect(is.string(faker.internet.userName())).toBeTruthy()
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
      expect(is.array(faker.random.arrayElements())).toBeTruthy()
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

  describe('maximus.is.number', () => {
    test('should ensure the value is a number', () => {
      expect(is.number(faker.random.number())).toBeTruthy()
    })

    test('given an invalid number', () => {
      expect(is.number(undefined)).toBeFalsy()
    })

    test('given an invalid number', () => {
      expect(is.number(null)).toBeFalsy()
    })

    test('given an invalid number', () => {
      expect(is.number()).toBeFalsy()
    })
  })
})
