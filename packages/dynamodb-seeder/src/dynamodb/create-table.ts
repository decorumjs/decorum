import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { CreateTableCommand, CreateTableInput, CreateTableOutput } from '@aws-sdk/client-dynamodb'
import { TableDefinition } from '../types'
import { mapKeyAttributes, mapKeySchema } from './mappings'

export default function createTable(
  client: DynamoDBDocumentClient,
  table: TableDefinition,
): Promise<CreateTableOutput> {
  const { name, throughput, keys } = table

  const params: CreateTableInput = {
    TableName: name,
    AttributeDefinitions: mapKeyAttributes(keys),
    KeySchema: mapKeySchema(keys),
    ProvisionedThroughput: {
      ReadCapacityUnits: throughput.readCapacityUnits,
      WriteCapacityUnits: throughput.writeCapacityUnits,
    },
  }

  return client.send(new CreateTableCommand(params))
}
