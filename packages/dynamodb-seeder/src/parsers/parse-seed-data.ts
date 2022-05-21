import assert from 'assert'
import { SeedData } from '../types'

import parseTable from './parse-table'
import parseIndex from './parse-index'

export default function parseSeedData(doc: unknown): SeedData {
  const { tables, indexes, items } = doc as Record<string, unknown>

  assert(tables == null || Array.isArray(tables), 'Table definitions must be an array')
  assert(indexes == null || Array.isArray(indexes), 'Index definitions must be an array')
  assert(items == null || Array.isArray(items), 'Item arrays must be an array')

  return {
    tables: tables ? tables.map(parseTable) : undefined,
    indexes: indexes ? indexes.map(parseIndex) : undefined,
    items: undefined,
  }
}
