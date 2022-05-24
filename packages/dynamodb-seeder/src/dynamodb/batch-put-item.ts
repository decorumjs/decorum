import assert from 'assert'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { BatchWriteItemCommand, BatchWriteItemInput, BatchWriteItemOutput } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { Item } from '../types'

const MAX_BATCH_SIZE = 25

export default function batchPutItem(
  client: DynamoDBDocumentClient,
  tableName: string,
  items: Item[],
): Promise<BatchWriteItemOutput> {
  assert(items.length <= MAX_BATCH_SIZE, 'Items cannot exceed max batch size')

  const params: BatchWriteItemInput = {
    RequestItems: {
      [tableName]: items.map((item) => ({
        PutRequest: {
          Item: marshall(item),
        },
      })),
    },
  }

  return client.send(new BatchWriteItemCommand(params))
}
