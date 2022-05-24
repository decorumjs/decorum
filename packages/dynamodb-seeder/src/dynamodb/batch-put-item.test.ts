/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { Item } from '../types'

import batchPutItem from './batch-put-item'

describe('batchPutItem() function', () => {
  let client: DynamoDBDocumentClient
  let mockSend: jest.SpyInstance
  let items: Item[]

  beforeEach(() => {
    client = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        endpoint: 'http://localhost:1234',
        region: 'test',
      }),
    )

    mockSend = jest.spyOn(client, 'send')
    mockSend.mockImplementation(() => Promise.resolve())

    items = []
    for (let i = 1; i <= 10; i++) {
      items.push({ PK: `item#id-${i.toString().padStart(4, '0')}` })
    }
  })

  it('should throw error when `items` exceeds max batch size', async () => {
    items = [...items, ...items, ...items, ...items, ...items]

    expect(() => batchPutItem(client, 'TestTable', items)).toThrowError(/cannot exceed max batch size/i)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('should set table name in command input', async () => {
    const tableName = 'TestTable'
    await batchPutItem(client, tableName, items)
    expect(mockSend).toHaveBeenCalledWith(expect.any(BatchWriteItemCommand))

    const { input } = mockSend.mock.calls[0][0] as BatchWriteItemCommand
    expect(input.RequestItems![tableName]).not.toBeUndefined()
  })

  it('should map items to put request in command input', async () => {
    const tableName = 'TestTable'
    await batchPutItem(client, tableName, items)
    expect(mockSend).toHaveBeenCalledWith(expect.any(BatchWriteItemCommand))

    const { input } = mockSend.mock.calls[0][0] as BatchWriteItemCommand
    const requestItems = input.RequestItems![tableName]

    for (let i = 0; i < items.length; i++) {
      const { Item: marshalledItem } = requestItems[i].PutRequest!
      expect(marshalledItem).toEqual(marshall(items[i]))
    }
  })

  it('should pass output from command result', async () => {
    const mockResult = { message: 'Success' }
    mockSend.mockResolvedValueOnce(mockResult)

    await expect(batchPutItem(client, 'TestTable', items)).resolves.toEqual(mockResult)
    expect(mockSend).toHaveBeenCalledWith(expect.any(BatchWriteItemCommand))
  })
})
