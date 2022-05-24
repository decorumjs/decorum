import { IndexDefinition, ItemCollection, SeedData, TableDefinition } from '../types'

export function aggregateTables(dataFiles: SeedData[]): TableDefinition[] {
  return dataFiles.reduce((array, { tables = [] }) => [...array, ...tables], [] as TableDefinition[])
}

export function aggregateIndexes(dataFiles: SeedData[]): IndexDefinition[] {
  return dataFiles.reduce((array, { indexes = [] }) => [...array, ...indexes], [] as IndexDefinition[])
}

export function aggregateCollections(dataFiles: SeedData[]): ItemCollection[] {
  const allCollections = dataFiles.reduce(
    (array, { collections = [] }) => [...array, ...collections],
    [] as ItemCollection[],
  )

  const collectionGroup = allCollections.reduce((map, collection) => {
    const { tableName, items } = collection
    if (items.length > 0) {
      const existingItems = map[tableName]?.items ?? []
      map[tableName] = {
        tableName,
        items: [...existingItems, ...items],
      }
    }
    return map
  }, {} as Record<string, ItemCollection>)

  return Object.values(collectionGroup)
}
