import assert from 'assert'
import { AttributeDefinition, AttributeTypes, TableDefinition } from '../types'

const ATTRIBUTE_TYPE_VALUES = Object.values(AttributeTypes)

export default function parseTable(table: unknown): TableDefinition {
  const { name, throughput, keys } = table as Record<string, unknown>

  assert(!!(name as string)?.trim(), 'Table name must be specified')
  assert(!!throughput, 'Table throughput must be specified')
  assert(typeof throughput === 'object', 'Table throughput definition is invalid')

  assert(!!keys, 'Table key schema must be specified')
  assert(typeof keys === 'object', 'Table key schema definition is invalid')

  const { readCapacityUnits, writeCapacityUnits } = throughput as Record<string, number>
  assert(Number.isInteger(readCapacityUnits), 'Table read capacity units must be an integer value')
  assert(readCapacityUnits >= 0, 'Table read capacity units must be a positive integer value')
  assert(Number.isInteger(writeCapacityUnits), 'Table write capacity units must be an integer value')
  assert(writeCapacityUnits >= 0, 'Table write capacity units must be a positive integer value')

  const { partitionKey, sortKey } = keys as Record<string, AttributeDefinition>
  assert(!!partitionKey, 'Table partition key must be specified')

  if (partitionKey != null) {
    assert(typeof partitionKey === 'object', 'Table partition key definition is invalid')

    const { name, type } = partitionKey as Record<string, unknown>
    assert(name && typeof name === 'string', 'Table partition key name must be a string')
    assert(name.trim(), 'Table partition key name must be specified')

    assert(type && typeof type === 'string', 'Table partition key type must be a string')
    assert(ATTRIBUTE_TYPE_VALUES.includes(type as AttributeTypes), 'Table partition key type is invalid')
  }

  if (sortKey != null) {
    assert(typeof sortKey === 'object', 'Table sort key definition is invalid')

    const { name, type } = sortKey as Record<string, unknown>
    assert(name && typeof name === 'string', 'Table sort key name must be a string')
    assert(name.trim(), 'Table sort key name must be specified')

    assert(type && typeof type === 'string', 'Table sort key type must be a string')
    assert(ATTRIBUTE_TYPE_VALUES.includes(type as AttributeTypes), 'Table sort key type is invalid')
  }

  return {
    name: name as string,
    throughput: {
      readCapacityUnits: readCapacityUnits as number,
      writeCapacityUnits: writeCapacityUnits as number,
    },
    keys: {
      partitionKey,
      sortKey,
    },
  }
}
