import parseThroughput from './parse-throughput'

describe('parseThroughput() function', () => {
  let data: Record<string, unknown>

  beforeEach(() => {
    data = {
      readCapacityUnits: 10,
      writeCapacityUnits: 10,
    }
  })

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['boolean', true],
    ['number', 1],
    ['empty', ''],
    ['string', 'test'],
    ['array', []],
  ])('should throw error when `data` is %s', (_, value) => {
    expect(() => parseThroughput(value)).toThrowError(/throughput must be an object/i)
  })

  describe('readCapacityUnits property', () => {
    it('should return value from data', () => {
      const throughput = parseThroughput(data)
      expect(throughput.readCapacityUnits).toEqual(data.readCapacityUnits)
    })

    it.each([
      ['undefined', undefined, /read capacity units must be an integer/i],
      ['null', undefined, /read capacity units must be an integer/i],
      ['empty', '', /read capacity units must be an integer/i],
      ['boolean', true, /read capacity units must be an integer/i],
      ['float', 3.14, /read capacity units must be an integer/i],
      ['string', 'test', /read capacity units must be an integer/i],
      ['array', [], /read capacity units must be an integer/i],
      ['object', {}, /read capacity units must be an integer/i],
    ])('should throw error when `readCapacityUnits` is %s', (_, value, errorPattern) => {
      data.readCapacityUnits = value
      expect(() => parseThroughput(data)).toThrowError(errorPattern)
    })

    it('should throw error when `readCapacityUnits` is a negative value', () => {
      data.readCapacityUnits = -1
      expect(() => parseThroughput(data)).toThrowError(/read capacity units must be a positive integer/i)
    })
  })

  describe('writeCapacityUnits property', () => {
    it('should return value from data', () => {
      const throughput = parseThroughput(data)
      expect(throughput.writeCapacityUnits).toEqual(data.writeCapacityUnits)
    })

    it.each([
      ['undefined', undefined, /write capacity units must be an integer/i],
      ['null', undefined, /write capacity units must be an integer/i],
      ['empty', '', /write capacity units must be an integer/i],
      ['boolean', true, /write capacity units must be an integer/i],
      ['float', 3.14, /write capacity units must be an integer/i],
      ['string', 'test', /write capacity units must be an integer/i],
      ['array', [], /write capacity units must be an integer/i],
      ['object', {}, /write capacity units must be an integer/i],
    ])('should throw error when `writeCapacityUnits` is %s', (_, value, errorPattern) => {
      data.writeCapacityUnits = value
      expect(() => parseThroughput(data)).toThrowError(errorPattern)
    })

    it('should throw error when `writeCapacityUnits` is a negative value', () => {
      data.writeCapacityUnits = -1
      expect(() => parseThroughput(data)).toThrowError(/write capacity units must be a positive integer/i)
    })
  })
})
