const mx = require('../index')

describe('maximus.isEmpty', () => {
  test('should validate if value is empty', () => {
    expect(mx.isEmpty(undefined)).toBeTruthy()
    expect(mx.isEmpty(null)).toBeTruthy()
    expect(mx.isEmpty('')).toBeTruthy()
    expect(mx.isEmpty([])).toBeTruthy()
    expect(mx.isEmpty({})).toBeTruthy()
    expect(mx.isEmpty(new Date())).toBeFalsy()
  })
})
