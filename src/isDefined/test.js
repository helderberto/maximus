import isDefined from '.'
import faker from 'faker'

describe('maximus.isDefined', () => {
  test('should validate if value is defined', () => {
    expect(isDefined(faker.lorem.word())).toBeTruthy()
    expect(isDefined(faker.random.number())).toBeTruthy()
    expect(isDefined(undefined)).toBeFalsy()
    expect(isDefined(null)).toBeFalsy()
  })
})
