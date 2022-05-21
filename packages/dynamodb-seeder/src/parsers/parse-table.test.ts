import parseTable from './parse-table'
import { AttributeTypes } from '../types'

describe('parseTable() function', () => {
  let data: Record<string, unknown>

  beforeEach(() => {
    data = {
      name: 'TestTable',
      throughput: {
        readCapacityUnits: 10,
        writeCapacityUnits: 10,
      },
      keys: {
        partitionKey: {
          name: 'PK',
          type: AttributeTypes.String,
        },
        sortKey: {
          name: 'SK',
          type: AttributeTypes.String,
        },
      },
    }
  })

  describe('name property', () => {
    it('should return `name` from table definition', () => {
      const table = parseTable(data)
      expect(table.name).toEqual(data.name)
    })

    it.each([
      ['undefined', undefined, /name must be specified/i],
      ['null', null, /name must be specified/i],
      ['empty', '', /name must be specified/i],
      ['whitespace', ' ', /name must be specified/i],
    ])('should throw error when `name` is %s', (_, value, errorPattern) => {
      data.name = value
      expect(() => parseTable(data)).toThrowError(errorPattern)
    })
  })

  describe('throughput object', () => {
    it('should return `throughput` from table definition', () => {
      const { throughput } = parseTable(data)
      expect(throughput).toEqual(data.throughput)
    })
  })

  describe('keys object', () => {
    it('should return `keys` from table definition', () => {
      const { keys } = parseTable(data)
      expect(keys).toEqual(data.keys)
    })
  })
})
