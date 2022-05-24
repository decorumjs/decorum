import { AttributeType, IndexDefinition, KeySchema, Projection, ProjectionType, Throughput } from '../types'

export default function mockIndex(
  name: string,
  tableName: string,
  throughput?: Throughput,
  keys?: KeySchema,
  projection?: Projection,
): IndexDefinition {
  return {
    name,
    tableName,
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
    projection: projection ?? {
      type: ProjectionType.All,
    },
  }
}
