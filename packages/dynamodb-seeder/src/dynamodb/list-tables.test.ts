import { ListTablesCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import listTables from './list-tables'

describe('listTables() function', () => {
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

  it('should pass output from command result', async () => {
    const mockResult = { TableNames: ['TestTable'] }
    mockSend.mockResolvedValueOnce(mockResult)

    await expect(listTables(client)).resolves.toEqual(mockResult)
    expect(mockSend).toHaveBeenCalledWith(expect.any(ListTablesCommand))
  })
})
