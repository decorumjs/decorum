import { AttributeType, KeySchema, TableDefinition, Throughput } from '../types'

export default function mockTable(name: string, throughput?: Throughput, keys?: KeySchema): TableDefinition {
  return {
    name,
    throughput: throughput ?? {
      readCapacityUnits: 10,
      writeCapacityUnits: 10,
    },
    keys: keys ?? {
      partitionKey: {
        name: 'PK',
        type: AttributeType.String,
      },
      sortKey: {
        name: 'SK',
        type: AttributeType.Number,
      },
    },
  }
}
