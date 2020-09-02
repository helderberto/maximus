import { is } from '.'
import faker from 'faker'

describe('maximus.is', () => {
  test('should validate data types', () => {
    expect(is(Object, {})).toBeTruthy()
    expect(is(Object, null)).toBeFalsy()
    expect(is(Array, undefined)).toBeFalsy()
    expect(is(Array, faker.random.arrayElements())).toBeTruthy()
    expect(is(Date, faker.date.past())).toBeTruthy()
    expect(is(Date, undefined)).toBeFalsy()
    expect(is(String, faker.lorem.word())).toBeTruthy()
    expect(is(String, faker.random.number())).toBeFalsy()
    expect(is(Number, faker.random.number())).toBeTruthy()
    expect(is(Number, undefined)).toBeFalsy()
    expect(is(Number, null)).toBeFalsy()
    expect(is(undefined)).toBeTruthy()
    expect(is(null)).toBeTruthy()
  })
})
