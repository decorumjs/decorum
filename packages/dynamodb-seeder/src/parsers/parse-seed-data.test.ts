import parseSeedData from './parse-seed-data'

describe('parseSeedData() function', () => {
  let data: Record<string, unknown>

  beforeEach(() => {
    data = {
      tables: [],
      indexes: [],
      collections: [],
    }
  })

  it.each([
    ['tables', 'boolean', true, /table definitions must be an array/i],
    ['tables', 'number', 1, /table definitions must be an array/i],
    ['tables', 'empty', '', /table definitions must be an array/i],
    ['tables', 'string', 'test', /table definitions must be an array/i],
    ['tables', 'object', {}, /table definitions must be an array/i],
    ['indexes', 'boolean', true, /index definitions must be an array/i],
    ['indexes', 'number', 1, /index definitions must be an array/i],
    ['indexes', 'empty', '', /index definitions must be an array/i],
    ['indexes', 'string', 'test', /index definitions must be an array/i],
    ['indexes', 'object', {}, /index definitions must be an array/i],
    ['collections', 'boolean', true, /item collections must be an array/i],
    ['collections', 'number', 1, /item collections must be an array/i],
    ['collections', 'empty', '', /item collections must be an array/i],
    ['collections', 'string', 'test', /item collections must be an array/i],
    ['collections', 'object', {}, /item collections must be an array/i],
  ])('should throw error when `%s` is %s', (key, _, value, errorPattern) => {
    data[key] = value
    expect(() => parseSeedData(data)).toThrowError(errorPattern)
  })

  describe('table definitions', () => {
    it('should parse table definitions array', () => {
      const { tables } = parseSeedData(data)
      expect(tables).toEqual(data.tables)
    })

    it.each([undefined, null])('should return undefined when value is %s', (value) => {
      data.tables = value
      const { tables } = parseSeedData(data)
      expect(tables).toBeUndefined()
    })
  })

  describe('index definitions', () => {
    it('should parse index definitions array', () => {
      const { indexes } = parseSeedData(data)
      expect(indexes).toEqual(data.indexes)
    })

    it.each([undefined, null])('should return undefined when value is %s', (value) => {
      data.indexes = value
      const { indexes } = parseSeedData(data)
      expect(indexes).toBeUndefined()
    })
  })

  describe('item collections', () => {
    it('should parse item collections array', () => {
      const { collections } = parseSeedData(data)
      expect(collections).toEqual(data.collections)
    })

    it.each([undefined, null])('should return undefined when value is %s', (value) => {
      data.collections = value
      const { collections } = parseSeedData(data)
      expect(collections).toBeUndefined()
    })
  })
})
