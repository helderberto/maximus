import { isEmpty } from '.'

describe('maximus.isEmpty', () => {
  test('should validate if value is empty', () => {
    expect(isEmpty(undefined)).toBeTruthy()
    expect(isEmpty(null)).toBeTruthy()
    expect(isEmpty('')).toBeTruthy()
    expect(isEmpty([])).toBeTruthy()
  })
})
