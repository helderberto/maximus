const mx = require('../index')
import faker from 'faker'

describe('maximus.is', () => {
  test('should validate data types', () => {
    expect(mx.is(Object, {})).toBeTruthy()
    expect(mx.is(Object, null)).toBeFalsy()
    expect(mx.is(Array, undefined)).toBeFalsy()
    expect(mx.is(Array, faker.random.arrayElements())).toBeTruthy()
    expect(mx.is(Date, faker.date.past())).toBeTruthy()
    expect(mx.is(Date, undefined)).toBeFalsy()
    expect(mx.is(String, faker.lorem.word())).toBeTruthy()
    expect(mx.is(String, faker.random.number())).toBeFalsy()
    expect(mx.is(Number, faker.random.number())).toBeTruthy()
    expect(mx.is(Number, undefined)).toBeFalsy()
    expect(mx.is(Number, null)).toBeFalsy()
    expect(mx.is(undefined)).toBeTruthy()
    expect(mx.is(null)).toBeTruthy()
  })
})
