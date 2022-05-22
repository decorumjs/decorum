import assert from 'assert'
import { Item, ItemCollection } from '../types'

export default function parseItemCollection(data: unknown): ItemCollection {
  const { tableName, items } = data as Record<string, unknown>

  assert(!!(tableName as string)?.trim(), 'Table name must be specified')

  assert(
    items && Array.isArray(items) && items.every((item) => item && typeof item === 'object' && !Array.isArray(item)),
    'Items must be an array of objects',
  )

  return {
    tableName: tableName as string,
    items: items as Item[],
  }
}
