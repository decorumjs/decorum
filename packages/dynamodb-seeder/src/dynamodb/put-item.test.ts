/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { PutItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { Item } from '../types'

import putItem from './put-item'

describe('putItem() function', () => {
  let client: DynamoDBDocumentClient
  let mockSend: jest.SpyInstance
  let item: Item

  beforeEach(() => {
    client = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        endpoint: 'http://localhost:1234',
        region: 'test',
      }),
    )

    mockSend = jest.spyOn(client, 'send')
    mockSend.mockImplementation(() => Promise.resolve())

    item = {
      PK: 'item#1',
      SK: '2000-01-01',
      FirstAttribute: 'Something',
      SecondAttribute: 'Else',
    }
  })

  it('should set table name in command input', async () => {
    const tableName = 'TestTable'
    await putItem(client, tableName, item)
    expect(mockSend).toHaveBeenCalledWith(expect.any(PutItemCommand))

    const { input } = mockSend.mock.calls[0][0] as PutItemCommand
    expect(input.TableName).toEqual(tableName)
  })

  it('should marshall item attributes in command input', async () => {
    await putItem(client, 'TestTable', item)
    expect(mockSend).toHaveBeenCalledWith(expect.any(PutItemCommand))

    const { input } = mockSend.mock.calls[0][0] as PutItemCommand
    expect(input.Item).toEqual(marshall(item))
  })

  it('should pass output from command result', async () => {
    const mockResult = { message: 'Success' }
    mockSend.mockResolvedValueOnce(mockResult)

    await expect(putItem(client, 'TestTable', item)).resolves.toEqual(mockResult)
    expect(mockSend).toHaveBeenCalledWith(expect.any(PutItemCommand))
  })
})
