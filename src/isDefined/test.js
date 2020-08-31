const mx = require('../index')
import faker from 'faker'

describe('maximus.isDefined', () => {
  test('should validate if value is defined', () => {
    expect(mx.isDefined(faker.lorem.word())).toBeTruthy()
    expect(mx.isDefined(faker.random.number())).toBeTruthy()
    expect(mx.isDefined(undefined)).toBeFalsy()
    expect(mx.isDefined(null)).toBeFalsy()
  })
})
