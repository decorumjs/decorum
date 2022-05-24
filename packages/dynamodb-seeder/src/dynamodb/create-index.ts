import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { UpdateTableCommand, UpdateTableInput, UpdateTableOutput } from '@aws-sdk/client-dynamodb'
import { IndexDefinition } from '../types'
import { mapKeyAttributes, mapKeySchema } from './mappings'

export default function createIndex(
  client: DynamoDBDocumentClient,
  index: IndexDefinition,
): Promise<UpdateTableOutput> {
  const { name, tableName, throughput, keys, projection } = index

  const params: UpdateTableInput = {
    TableName: tableName,
    AttributeDefinitions: mapKeyAttributes(keys),
    GlobalSecondaryIndexUpdates: [
      {
        Create: {
          IndexName: name,
          KeySchema: mapKeySchema(keys),
          Projection: {
            ProjectionType: projection.type.toUpperCase(),
            NonKeyAttributes: projection.attributes,
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: throughput.readCapacityUnits,
            WriteCapacityUnits: throughput.writeCapacityUnits,
          },
        },
      },
    ],
  }

  return client.send(new UpdateTableCommand(params))
}
