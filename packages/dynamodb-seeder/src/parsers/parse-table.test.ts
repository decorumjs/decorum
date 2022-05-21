import parseTable from './parse-table'
import { AttributeDefinition } from '../types'

describe('parseTable() function', () => {
  let tableData: Record<string, unknown>

  beforeEach(() => {
    tableData = {
      name: 'TestTable',
      throughput: {
        readCapacityUnits: 10,
        writeCapacityUnits: 10,
      },
      keys: {
        partitionKey: {
          name: 'PK',
          type: 'string',
        },
        sortKey: {
          name: 'SK',
          type: 'string',
        },
      },
    }
  })

  describe('name property', () => {
    it('should return `name` from table definition', () => {
      const table = parseTable(tableData)
      expect(table.name).toEqual(tableData.name)
    })

    it.each([
      ['undefined', undefined, /name must be specified/i],
      ['null', null, /name must be specified/i],
      ['empty', '', /name must be specified/i],
      ['whitespace', ' ', /name must be specified/i],
    ])('should throw error when `name` is %s', (_, value, errorPattern) => {
      tableData.name = value
      expect(() => parseTable(tableData)).toThrowError(errorPattern)
    })
  })

  describe('throughput object', () => {
    it.each([
      ['undefined', undefined, /throughput must be specified/i],
      ['null', null, /throughput must be specified/i],
      ['empty string', '', /throughput must be specified/i],
      ['boolean', true, /throughput definition is invalid/i],
      ['number', 10, /throughput definition is invalid/i],
      ['string', 'test', /throughput definition is invalid/i],
    ])('should throw error when `throughput` is %s', (_, value, errorPattern) => {
      tableData.throughput = value
      expect(() => parseTable(tableData)).toThrowError(errorPattern)
    })

    describe('readCapacityUnits property', () => {
      it('should return `readCapacityUnits` from throughput definition', () => {
        const table = parseTable(tableData)
        const throughputData = tableData.throughput as Record<string, number>
        expect(table.throughput.readCapacityUnits).toEqual(throughputData.readCapacityUnits)
      })

      it.each([
        ['undefined', undefined, /read capacity units must be an integer/i],
        ['null', null, /read capacity units must be an integer/i],
        ['empty', '', /read capacity units must be an integer/i],
        ['whitespace', ' ', /read capacity units must be an integer/i],
        ['float', 3.14, /read capacity units must be an integer/i],
        ['negative', -1, /read capacity units must be a positive integer/i],
      ])('should throw error when `readCapacityUnits` is %s', (_, value, errorString) => {
        const throughputData = tableData.throughput as Record<string, unknown>
        throughputData.readCapacityUnits = value
        expect(() => parseTable(tableData)).toThrowError(errorString)
      })
    })

    describe('writeCapacityUnits property', () => {
      it('should return `writeCapacityUnits` from throughput definition', () => {
        const table = parseTable(tableData)
        const throughputData = tableData.throughput as Record<string, number>
        expect(table.throughput.writeCapacityUnits).toEqual(throughputData.writeCapacityUnits)
      })

      it.each([
        ['undefined', undefined, /write capacity units must be an integer/i],
        ['null', null, /write capacity units must be an integer/i],
        ['empty', '', /write capacity units must be an integer/i],
        ['whitespace', ' ', /write capacity units must be an integer/i],
        ['float', 3.14, /write capacity units must be an integer/i],
        ['negative', -1, /write capacity units must be a positive integer/i],
      ])('should throw error when `writeCapacityUnits` is %s', (_, value, errorPattern) => {
        const throughputData = tableData.throughput as Record<string, unknown>
        throughputData.writeCapacityUnits = value
        expect(() => parseTable(tableData)).toThrowError(errorPattern)
      })
    })
  })

  describe('keys object', () => {
    it.each([
      ['undefined', undefined, /key schema must be specified/i],
      ['null', null, /key schema must be specified/i],
      ['empty string', '', /key schema must be specified/i],
      ['boolean', true, /key schema definition is invalid/i],
      ['number', 10, /key schema definition is invalid/i],
      ['string', 'test', /key schema definition is invalid/i],
    ])('should throw error when `keys` is %s', (_, value, errorPattern) => {
      tableData.keys = value
      expect(() => parseTable(tableData)).toThrowError(errorPattern)
    })

    describe('partitionKey object', () => {
      it.each([
        ['undefined', undefined, /partition key must be specified/i],
        ['null', null, /partition key must be specified/i],
        ['empty string', '', /partition key must be specified/i],
        ['boolean', true, /partition key definition is invalid/i],
        ['number', 10, /partition key definition is invalid/i],
        ['string', 'test', /partition key definition is invalid/i],
      ])('should throw error when `partitionKey` is %s', (_, value, errorPattern) => {
        const keySchema = tableData.keys as Record<string, unknown>
        keySchema.partitionKey = value
        expect(() => parseTable(tableData)).toThrowError(errorPattern)
      })

      it.each([
        ['undefined', undefined, /partition key name must be a string/i],
        ['null', null, /partition key name must be a string/i],
        ['boolean', true, /partition key name must be a string/i],
        ['number', 10, /partition key name must be a string/i],
        ['empty string', '', /partition key name must be a string/i],
        ['whitespace', ' ', /partition key name must be specified/i],
      ])('should throw error when `name` is %s', (_, value, errorPattern) => {
        const keySchema = tableData.keys as Record<string, unknown>
        const partitionKey = keySchema.partitionKey as Record<string, unknown>
        partitionKey.name = value
        expect(() => parseTable(tableData)).toThrowError(errorPattern)
      })

      it.each([
        ['undefined', undefined, /partition key type must be a string/i],
        ['null', null, /partition key type must be a string/i],
        ['boolean', true, /partition key type must be a string/i],
        ['number', 10, /partition key type must be a string/i],
        ['empty string', '', /partition key type must be a string/i],
        ['whitespace', ' ', /partition key type is invalid/i],
        ['invalid string', 'test', /partition key type is invalid/i],
      ])('should throw error when `type` is %s', (_, value, errorPattern) => {
        const keySchema = tableData.keys as Record<string, unknown>
        const partitionKey = keySchema.partitionKey as Record<string, unknown>
        partitionKey.type = value
        expect(() => parseTable(tableData)).toThrowError(errorPattern)
      })
    })

    describe('sortKey object', () => {
      it('should return `partitionKey` from key schema', () => {
        const table = parseTable(tableData)
        const keySchema = tableData.keys as Record<string, AttributeDefinition>
        expect(table.keys.partitionKey).toEqual(keySchema.partitionKey)
      })

      it('should return `sortKey` from key schema', () => {
        const table = parseTable(tableData)
        const keySchema = tableData.keys as Record<string, AttributeDefinition>
        expect(table.keys.sortKey).toEqual(keySchema.sortKey)
      })

      it.each([
        ['empty string', '', /sort key definition is invalid/i],
        ['boolean', true, /sort key definition is invalid/i],
        ['number', 10, /sort key definition is invalid/i],
        ['string', 'test', /sort key definition is invalid/i],
      ])('should throw error when `sortKey` is %s', (_, value, errorPattern) => {
        const keySchema = tableData.keys as Record<string, unknown>
        keySchema.sortKey = value
        expect(() => parseTable(tableData)).toThrowError(errorPattern)
      })

      it.each([
        ['undefined', undefined, /sort key name must be a string/i],
        ['null', null, /sort key name must be a string/i],
        ['boolean', true, /sort key name must be a string/i],
        ['number', 10, /sort key name must be a string/i],
        ['empty string', '', /sort key name must be a string/i],
        ['whitespace', ' ', /sort key name must be specified/i],
      ])('should throw error when `name` is %s', (_, value, errorPattern) => {
        const keySchema = tableData.keys as Record<string, unknown>
        const sortKey = keySchema.sortKey as Record<string, unknown>
        sortKey.name = value
        expect(() => parseTable(tableData)).toThrowError(errorPattern)
      })

      it.each([
        ['undefined', undefined, /sort key type must be a string/i],
        ['null', null, /sort key type must be a string/i],
        ['boolean', true, /sort key type must be a string/i],
        ['number', 10, /sort key type must be a string/i],
        ['empty string', '', /sort key type must be a string/i],
        ['whitespace', ' ', /sort key type is invalid/i],
        ['invalid string', 'test', /sort key type is invalid/i],
      ])('should throw error when `type` is %s', (_, value, errorPattern) => {
        const keySchema = tableData.keys as Record<string, unknown>
        const sortKey = keySchema.sortKey as Record<string, unknown>
        sortKey.type = value
        expect(() => parseTable(tableData)).toThrowError(errorPattern)
      })
    })
  })
})
