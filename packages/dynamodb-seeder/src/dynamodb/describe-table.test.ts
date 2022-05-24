/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import describeTable from './describe-table'

describe('describeTable() function', () => {
  let client: DynamoDBDocumentClient
  let mockSend: jest.SpyInstance

  beforeEach(() => {
    client = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        endpoint: 'http://localhost:1234',
        region: 'test',
      }),
    )

    mockSend = jest.spyOn(client, 'send')
    mockSend.mockImplementation(() => Promise.resolve())
  })

  it('should set table name in command input', async () => {
    const tableName = 'TestTable'
    await describeTable(client, tableName)
    expect(mockSend).toHaveBeenCalledWith(expect.any(DescribeTableCommand))

    const { input } = mockSend.mock.calls[0][0] as DescribeTableCommand
    expect(input.TableName).toEqual(tableName)
  })

  it('should pass output from command result', async () => {
    const mockResult = { message: 'Success' }
    mockSend.mockResolvedValueOnce(mockResult)

    await expect(describeTable(client, 'TestTable')).resolves.toEqual(mockResult)
    expect(mockSend).toHaveBeenCalledWith(expect.any(DescribeTableCommand))
  })
})
