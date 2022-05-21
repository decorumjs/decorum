import { AttributeType } from '../types'
import parseKeySchema from './parse-key-schema'

describe('parseKeySchema() function', () => {
  let data: Record<string, unknown>

  beforeEach(() => {
    data = {
      partitionKey: {
        name: 'PK',
        type: AttributeType.String,
      },
      sortKey: {
        name: 'SK',
        type: AttributeType.Number,
      },
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
    expect(() => parseKeySchema(value)).toThrowError(/key schema must be an object/i)
  })

  describe('partitionKey attribute', () => {
    it('should return value from data', () => {
      const keySchema = parseKeySchema(data)
      expect(keySchema.partitionKey).toEqual(data.partitionKey)
    })

    it.each([
      ['undefined', undefined],
      ['null', null],
    ])('should throw error when `partitionKey` is %s', (_, value) => {
      data.partitionKey = value
      expect(() => parseKeySchema(data)).toThrowError(/partition key must be specified/i)
    })

    it.each([
      ['undefined', undefined, /partition key name must be a string/i],
      ['null', null, /partition key name must be a string/i],
      ['boolean', true, /partition key name must be a string/i],
      ['number', 1, /partition key name must be a string/i],
      ['array', [], /partition key name must be a string/i],
      ['object', {}, /partition key name must be a string/i],
      ['empty', '', /partition key name cannot be empty or whitespace/i],
      ['whitespace', ' ', /partition key name cannot be empty or whitespace/i],
    ])('should throw error when `name` is %s', (_, value, errorPattern) => {
      const partitionKey = data.partitionKey as Record<string, unknown>
      partitionKey.name = value
      expect(() => parseKeySchema(data)).toThrowError(errorPattern)
    })

    it.each([
      ['undefined', undefined, /partition key type must be a string/i],
      ['null', null, /partition key type must be a string/i],
      ['boolean', true, /partition key type must be a string/i],
      ['number', 1, /partition key type must be a string/i],
      ['array', [], /partition key type must be a string/i],
      ['object', {}, /partition key type must be a string/i],
      ['empty', '', /partition key type cannot be empty or whitespace/i],
      ['whitespace', ' ', /partition key type cannot be empty or whitespace/i],
      ['invalid', 'test', /partition key type is invalid/i],
    ])('should throw error when `type` is %s', (_, value, errorPattern) => {
      const partitionKey = data.partitionKey as Record<string, unknown>
      partitionKey.type = value
      expect(() => parseKeySchema(data)).toThrowError(errorPattern)
    })
  })

  describe('sortKey attribute', () => {
    it('should return value from data', () => {
      const keySchema = parseKeySchema(data)
      expect(keySchema.sortKey).toEqual(data.sortKey)
    })

    it.each([
      ['undefined', undefined],
      ['null', null],
    ])('should allow `sortKey` to be %s', (_, value) => {
      data.sortKey = value
      const keySchema = parseKeySchema(data)
      expect(keySchema).toEqual(data)
    })

    it.each([
      ['undefined', undefined, /sort key name must be a string/i],
      ['null', null, /sort key name must be a string/i],
      ['boolean', true, /sort key name must be a string/i],
      ['number', 1, /sort key name must be a string/i],
      ['array', [], /sort key name must be a string/i],
      ['object', {}, /sort key name must be a string/i],
      ['empty', '', /sort key name cannot be empty or whitespace/i],
      ['whitespace', ' ', /sort key name cannot be empty or whitespace/i],
    ])('should throw error when `name` is %s', (_, value, errorPattern) => {
      const sortKey = data.sortKey as Record<string, unknown>
      sortKey.name = value
      expect(() => parseKeySchema(data)).toThrowError(errorPattern)
    })

    it.each([
      ['undefined', undefined, /sort key type must be a string/i],
      ['null', null, /sort key type must be a string/i],
      ['boolean', true, /sort key type must be a string/i],
      ['number', 1, /sort key type must be a string/i],
      ['array', [], /sort key type must be a string/i],
      ['object', {}, /sort key type must be a string/i],
      ['empty', '', /sort key type cannot be empty or whitespace/i],
      ['whitespace', ' ', /sort key type cannot be empty or whitespace/i],
      ['invalid', 'test', /sort key type is invalid/i],
    ])('should throw error when `type` is %s', (_, value, errorPattern) => {
      const sortKey = data.sortKey as Record<string, unknown>
      sortKey.type = value
      expect(() => parseKeySchema(data)).toThrowError(errorPattern)
    })
  })
})
