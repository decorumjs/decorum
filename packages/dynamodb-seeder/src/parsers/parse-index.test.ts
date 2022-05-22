import { AttributeType, ProjectionType } from '../types'
import parseIndex from './parse-index'

describe('parseIndex() function', () => {
  let data: Record<string, unknown>

  beforeEach(() => {
    data = {
      name: 'TextIndex',
      tableName: 'TestTable',
      throughput: {
        readCapacityUnits: 10,
        writeCapacityUnits: 10,
      },
      keys: {
        partitionKey: {
          name: 'PK',
          type: AttributeType.String,
        },
        sortKey: {
          name: 'SK',
          type: AttributeType.String,
        },
      },
      projection: {
        type: ProjectionType.Include,
        attributes: ['first', 'second', 'third'],
      },
    }
  })

  describe('name property', () => {
    it('should return `name` from index definition', () => {
      const tableIndex = parseIndex(data)
      expect(tableIndex.name).toEqual(data.name)
    })

    it.each([
      ['undefined', undefined, /name must be specified/i],
      ['null', null, /name must be specified/i],
      ['empty', '', /name must be specified/i],
      ['whitespace', ' ', /name must be specified/i],
    ])('should throw error when `name` is %s', (_, value, errorPattern) => {
      data.name = value
      expect(() => parseIndex(data)).toThrowError(errorPattern)
    })
  })

  describe('tableName property', () => {
    it('should return `tableName` from index definition', () => {
      const tableIndex = parseIndex(data)
      expect(tableIndex.tableName).toEqual(data.tableName)
    })

    it.each([
      ['undefined', undefined, /table name must be specified/i],
      ['null', null, /table name must be specified/i],
      ['empty', '', /table name must be specified/i],
      ['whitespace', ' ', /table name must be specified/i],
    ])('should throw error when `tableName` is %s', (_, value, errorPattern) => {
      data.tableName = value
      expect(() => parseIndex(data)).toThrowError(errorPattern)
    })
  })

  describe('throughput object', () => {
    it('should return `throughput` from index definition', () => {
      const { throughput } = parseIndex(data)
      expect(throughput).toEqual(data.throughput)
    })
  })

  describe('keys object', () => {
    it('should return `keys` from index definition', () => {
      const { keys } = parseIndex(data)
      expect(keys).toEqual(data.keys)
    })
  })

  describe('projection object', () => {
    it('should return `projection` from index definition', () => {
      const { projection } = parseIndex(data)
      expect(projection).toEqual(data.projection)
    })
  })
})
