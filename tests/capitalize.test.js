import { capitalize } from '../src/string'

describe('maximus.capitalize', () => {
  test('should capitalize the first letter of the text', () => {
    const word = 'any_test'
    expect(capitalize(word)).toBe('Any_test')
  })
})
