import assert from 'assert'
import { Throughput } from '../types'

export default function parseThroughput(data: unknown): Throughput {
  assert(data && typeof data === 'object' && !Array.isArray(data), 'Throughput must be an object')

  const { readCapacityUnits, writeCapacityUnits } = data as Record<string, number>

  assert(Number.isInteger(readCapacityUnits), 'Read capacity units must be an integer value')
  assert(readCapacityUnits >= 0, 'Read capacity units must be a positive integer value')

  assert(Number.isInteger(writeCapacityUnits), 'Write capacity units must be an integer value')
  assert(writeCapacityUnits >= 0, 'Write capacity units must be a positive integer value')

  return {
    readCapacityUnits,
    writeCapacityUnits,
  }
}
