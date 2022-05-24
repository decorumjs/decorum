import { Item, ItemCollection } from '../types'

export default function mockCollection(tableName: string, items?: Item[]): ItemCollection {
  return {
    tableName,
    items: items ?? [],
  }
}
