import assert from 'assert'
import { SeedData } from '../types'

import parseTable from './parse-table'
import parseIndex from './parse-index'
import parseItemCollection from './parse-item-collection'

export default function parseSeedData(data: unknown): SeedData {
  const { tables, indexes, collections } = data as Record<string, unknown>

  assert(tables == null || Array.isArray(tables), 'Table definitions must be an array')
  assert(indexes == null || Array.isArray(indexes), 'Index definitions must be an array')
  assert(collections == null || Array.isArray(collections), 'Item collections must be an array')

  return {
    tables: tables ? tables.map(parseTable) : undefined,
    indexes: indexes ? indexes.map(parseIndex) : undefined,
    collections: collections ? collections.map(parseItemCollection) : undefined,
  }
}
