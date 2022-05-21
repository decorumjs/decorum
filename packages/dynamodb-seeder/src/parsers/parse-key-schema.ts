import assert from 'assert'
import { AttributeDefinition, AttributeType, KeySchema } from '../types'

const ATTRIBUTE_TYPE_VALUES = Object.values(AttributeType)

export default function parseKeySchema(data: unknown): KeySchema {
  assert(!!data && typeof data === 'object' && !Array.isArray(data), 'Key schema must be an object')

  const { partitionKey, sortKey } = data as Record<string, AttributeDefinition>

  assert(partitionKey != null, 'Partition key must be specified')
  assert(typeof partitionKey === 'object' && !Array.isArray(partitionKey), 'Partition key must be an object')

  if (partitionKey != null) {
    const { name, type } = partitionKey as Record<string, unknown>

    assert(typeof name === 'string', 'Partition key name must be a string')
    assert(name.trim(), 'Partition key name cannot be empty or whitespace')

    assert(typeof type === 'string', 'Partition key type must be a string')
    assert(type.trim(), 'Partition key type cannot be empty or whitespace')
    assert(ATTRIBUTE_TYPE_VALUES.includes(type as AttributeType), 'Partition key type is invalid')
  }

  if (sortKey != null) {
    assert(typeof sortKey === 'object' && !Array.isArray(sortKey), 'Sort key must be an object')

    const { name, type } = sortKey as Record<string, unknown>

    assert(typeof name === 'string', 'Sort key name must be a string')
    assert(name.trim(), 'Sort key name cannot be empty or whitespace')

    assert(typeof type === 'string', 'Sort key type must be a string')
    assert(type.trim(), 'Sort key type cannot be empty or whitespace')
    assert(ATTRIBUTE_TYPE_VALUES.includes(type as AttributeType), 'Sort key type is invalid')
  }

  return {
    partitionKey,
    sortKey,
  }
}
