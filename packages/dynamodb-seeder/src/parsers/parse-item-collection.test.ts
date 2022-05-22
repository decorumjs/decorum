import parseItemCollection from './parse-item-collection'

describe('parseItemCollection() function', () => {
  let data: Record<string, unknown>

  beforeEach(() => {
    data = {
      tableName: 'TestTable',
      items: [
        {
          PK: 'item#1',
          SK: 1,
        },
        {
          PK: 'item#2',
          SK: 2,
        },
      ],
    }
  })

  describe('tableName property', () => {
    it('should return `tableName` from item collection', () => {
      const tableIndex = parseItemCollection(data)
      expect(tableIndex.tableName).toEqual(data.tableName)
    })

    it.each([
      ['undefined', undefined, /table name must be specified/i],
      ['null', null, /table name must be specified/i],
      ['empty', '', /table name must be specified/i],
      ['whitespace', ' ', /table name must be specified/i],
    ])('should throw error when `tableName` is %s', (_, value, errorPattern) => {
      data.tableName = value
      expect(() => parseItemCollection(data)).toThrowError(errorPattern)
    })
  })

  describe('items array', () => {
    it('should return from items collection array', () => {
      const { items } = parseItemCollection(data)
      expect(items).toEqual(data.items)
    })

    it.each([
      ['undefined', undefined],
      ['null', null],
      ['empty', ''],
      ['boolean', true],
      ['number', 1],
      ['string', 'test'],
      ['object', {}],
      ['array of non-objects', [1, 'test', true]],
    ])('should throw error when `items` is %s', (_, value) => {
      data.items = value
      expect(() => parseItemCollection(data)).toThrowError(/items must be an array of objects/i)
    })
  })
})
