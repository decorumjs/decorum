import { SeedData } from '../types'
import mockTable from '../fixtures/mock-table'
import mockIndex from '../fixtures/mock-index'
import mockCollection from '../fixtures/mock-collection'

import { aggregateCollections, aggregateIndexes, aggregateTables } from './aggregate-data'

describe('aggregate data helpers', () => {
  let dataArray: SeedData[]

  beforeEach(() => {
    dataArray = [
      {
        tables: [mockTable('MainTable'), mockTable('AnotherTable')],
        collections: [mockCollection('MainTable', [{ PK: 'item#1', SK: 1 }])],
      },
      {
        indexes: [mockIndex('GSI1', 'MainTable'), mockIndex('GSI2', 'MainTable')],
        collections: [mockCollection('MainTable', [{ PK: 'item#2', SK: 2 }])],
      },
      {
        tables: [mockTable('ThirdTable')],
        indexes: [mockIndex('ThirdIndex', 'ThirdIndex')],
        collections: [
          mockCollection('MainTable', [{ PK: 'item#3', SK: 3 }]),
          mockCollection('AnotherTable', [{ PK: 'test#9000', SK: 9000 }]),
        ],
      },
      {
        /* Intentionally empty seed data */
      },
    ]
  })

  describe('aggregateTables() function', () => {
    it('should collect all table definitions into single array', () => {
      const allTables = aggregateTables(dataArray)
      for (const { tables = [] } of dataArray) {
        tables.forEach((table) => expect(allTables).toContain(table))
      }
    })
  })

  describe('aggregateIndexes() function', () => {
    it('should collect all index definitions into single array', () => {
      const allIndexes = aggregateIndexes(dataArray)
      for (const { indexes = [] } of dataArray) {
        indexes.forEach((index) => expect(allIndexes).toContain(index))
      }
    })
  })

  describe('aggregateCollections() function', () => {
    it('should merge all item collections by table name', () => {
      const allCollections = aggregateCollections(dataArray)
      for (const { collections = [] } of dataArray) {
        for (const collection of collections) {
          const mergedCollection = allCollections.find((col) => col.tableName === collection.tableName)
          expect(mergedCollection).not.toBeUndefined()
          expect(mergedCollection?.items).toEqual(expect.arrayContaining(collection.items))
        }
      }
    })
  })
})
