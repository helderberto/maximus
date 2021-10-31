import { uniq } from '..'

describe('uniq', () => {
  it('should remove duplicated obejct items from the array and return a new array', () => {
    const uniqById = uniq('id')
    const array = [
      {
        id: 1,
        first_name: 'Philippe',
        last_name: 'Demogeot',
        email: 'pdemogeot0@vkontakte.ru',
      },
      {
        id: 2,
        first_name: 'Myranda',
        last_name: 'Arnaud',
        email: 'marnaud1@weather.com',
      },
      {
        id: 3,
        first_name: 'Laurel',
        last_name: 'Loosemore',
        email: 'lloosemore2@abc.net.au',
      },
      {
        id: 1,
        first_name: 'Cammy',
        last_name: 'Heyworth',
        email: 'cheyworth3@elpais.com',
      },
      {
        id: 5,
        first_name: 'Jodi',
        last_name: 'Calfe',
        email: 'jcalfe4@jiathis.com',
      },
      {
        id: 1,
        first_name: 'Patrizio',
        last_name: 'Dockrell',
        email: 'pdockrell5@github.io',
      },
      {
        id: 7,
        first_name: 'Jana',
        last_name: 'Bartholomieu',
        email: 'jbartholomieu6@alibaba.com',
      },
      {
        id: 1,
        first_name: 'Bronny',
        last_name: 'Fanner',
        email: 'bfanner7@craigslist.org',
      },
      {
        id: 9,
        first_name: 'Nessa',
        last_name: 'Flook',
        email: 'nflook8@pinterest.com',
      },
      {
        id: 1,
        first_name: 'Martelle',
        last_name: 'Macon',
        email: 'mmacon9@theatlantic.com',
      },
    ]
    const expected = [
      {
        email: 'mmacon9@theatlantic.com',
        first_name: 'Martelle',
        id: 1,
        last_name: 'Macon',
      },
      {
        email: 'marnaud1@weather.com',
        first_name: 'Myranda',
        id: 2,
        last_name: 'Arnaud',
      },
      {
        email: 'lloosemore2@abc.net.au',
        first_name: 'Laurel',
        id: 3,
        last_name: 'Loosemore',
      },
      {
        email: 'jcalfe4@jiathis.com',
        first_name: 'Jodi',
        id: 5,
        last_name: 'Calfe',
      },
      {
        email: 'jbartholomieu6@alibaba.com',
        first_name: 'Jana',
        id: 7,
        last_name: 'Bartholomieu',
      },
      {
        email: 'nflook8@pinterest.com',
        first_name: 'Nessa',
        id: 9,
        last_name: 'Flook',
      },
    ]
    expect(uniqById(array)).toEqual(expected)
  })

  it('should remove duplicated array items and return a new array', () => {
    const array = [
      'name1',
      'name2',
      'name3',
      'name1',
      'name4',
      'name1',
      'name5',
      'name6',
      'name6',
      'name8',
      'name7',
      'name8',
    ]
    const expected = [
      'name1',
      'name2',
      'name3',
      'name4',
      'name5',
      'name6',
      'name8',
      'name7',
    ]
    expect(uniq(array)).toEqual(expected)
  })
})
