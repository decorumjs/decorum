import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { ListTablesCommand, ListTablesInput, ListTablesOutput } from '@aws-sdk/client-dynamodb'

export default function listTables(client: DynamoDBDocumentClient): Promise<ListTablesOutput> {
  const params: ListTablesInput = {}
  return client.send(new ListTablesCommand(params))
}
