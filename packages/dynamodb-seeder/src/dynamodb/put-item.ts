import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { PutItemCommand, PutItemInput, PutItemOutput } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { Item } from '../types'

export default function putItem(client: DynamoDBDocumentClient, tableName: string, item: Item): Promise<PutItemOutput> {
  const params: PutItemInput = {
    TableName: tableName,
    Item: marshall(item),
  }

  return client.send(new PutItemCommand(params))
}
