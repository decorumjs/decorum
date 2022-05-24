import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { TableDefinition } from '../types'
import { mapAttributeDefinition, mapKeySchemaElement } from './mappings'
import mockTable from '../fixtures/mock-table'

import createTable from './create-table'

describe('createTable() function', () => {
  let client: DynamoDBDocumentClient
  let mockSend: jest.SpyInstance
  let table: TableDefinition

  beforeEach(() => {
    client = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        endpoint: 'http://localhost:1234',
        region: 'test',
      }),
    )

    mockSend = jest.spyOn(client, 'send')
    mockSend.mockImplementation(() => Promise.resolve())

    table = mockTable('TestTable')
  })

  it('should set table name in command input', async () => {
    await createTable(client, table)
    expect(mockSend).toHaveBeenCalledWith(expect.any(CreateTableCommand))

    const { input } = mockSend.mock.calls[0][0] as CreateTableCommand
    expect(input.TableName).toEqual(table.name)
  })

  it('should set provisioned throughput in command input', async () => {
    await createTable(client, table)
    expect(mockSend).toHaveBeenCalledWith(expect.any(CreateTableCommand))

    const { input } = mockSend.mock.calls[0][0] as CreateTableCommand

    expect(input.ProvisionedThroughput).toEqual({
      ReadCapacityUnits: table.throughput.readCapacityUnits,
      WriteCapacityUnits: table.throughput.writeCapacityUnits,
    })
  })

  it('should set partition key schema in command input', async () => {
    await createTable(client, table)
    expect(mockSend).toHaveBeenCalledWith(expect.any(CreateTableCommand))

    const { input } = mockSend.mock.calls[0][0] as CreateTableCommand

    const pkAttribute = mapAttributeDefinition(table.keys.partitionKey)
    const pkKeyElement = mapKeySchemaElement(table.keys.partitionKey.name, 'HASH')

    expect(input.AttributeDefinitions).toEqual(expect.arrayContaining([pkAttribute]))
    expect(input.KeySchema).toEqual(expect.arrayContaining([pkKeyElement]))
  })

  it('should set sort key schema in command input', async () => {
    await createTable(client, table)
    expect(mockSend).toHaveBeenCalledWith(expect.any(CreateTableCommand))

    const { input } = mockSend.mock.calls[0][0] as CreateTableCommand

    /* eslint-disable  @typescript-eslint/no-non-null-assertion */
    const skAttribute = mapAttributeDefinition(table.keys.sortKey!)
    const skKeyElement = mapKeySchemaElement(table.keys.sortKey!.name, 'RANGE')
    /* eslint-enable  @typescript-eslint/no-non-null-assertion */

    expect(input.AttributeDefinitions).toEqual(expect.arrayContaining([skAttribute]))
    expect(input.KeySchema).toEqual(expect.arrayContaining([skKeyElement]))
  })

  it('should pass output from command result', async () => {
    const mockResult = { message: 'Success' }
    mockSend.mockResolvedValueOnce(mockResult)

    await expect(createTable(client, table)).resolves.toEqual(mockResult)
    expect(mockSend).toHaveBeenCalledWith(expect.any(CreateTableCommand))
  })
})
