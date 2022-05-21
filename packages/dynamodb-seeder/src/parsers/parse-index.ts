import assert from 'assert'
import { IndexDefinition } from '../types'
import parseThroughput from './parse-throughput'
import parseKeySchema from './parse-key-schema'
import parseProjection from './parse-projection'

export default function parseIndex(data: unknown): IndexDefinition {
  const { name, tableName, throughput, keys, projection } = data as Record<string, unknown>

  assert(!!(name as string)?.trim(), 'Index name must be specified')
  assert(!!(tableName as string)?.trim(), 'Index table name must be specified')

  return {
    name: name as string,
    tableName: tableName as string,
    throughput: parseThroughput(throughput),
    keys: parseKeySchema(keys),
    projection: parseProjection(projection),
  }
}
