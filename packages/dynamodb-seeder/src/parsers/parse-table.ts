import assert from 'assert'
import { TableDefinition } from '../types'
import parseThroughput from './parse-throughput'
import parseKeySchema from './parse-key-schema'

export default function parseTable(data: unknown): TableDefinition {
  const { name, throughput, keys } = data as Record<string, unknown>

  assert(!!(name as string)?.trim(), 'Table name must be specified')

  return {
    name: name as string,
    throughput: parseThroughput(throughput),
    keys: parseKeySchema(keys),
  }
}
