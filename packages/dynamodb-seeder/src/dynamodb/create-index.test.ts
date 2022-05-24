/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { DynamoDBClient, UpdateTableCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { IndexDefinition, ProjectionType } from '../types'
import { mapKeySchemaElement } from './mappings'
import mockIndex from '../fixtures/mock-index'

import createIndex from './create-index'

describe('createIndex() function', () => {
  let client: DynamoDBDocumentClient
  let mockSend: jest.SpyInstance
  let index: IndexDefinition

  beforeEach(() => {
    client = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        endpoint: 'http://localhost:1234',
        region: 'test',
      }),
    )

    mockSend = jest.spyOn(client, 'send')
    mockSend.mockImplementation(() => Promise.resolve())

    index = mockIndex('TestIndex', 'TestTable')
  })

  it('should set index name in command input', async () => {
    await createIndex(client, index)
    expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateTableCommand))

    const { input } = mockSend.mock.calls[0][0] as UpdateTableCommand
    const indexUpdate = input.GlobalSecondaryIndexUpdates![0].Create!
    expect(indexUpdate).not.toBeUndefined()

    expect(indexUpdate.IndexName).toEqual(index.name)
  })

  it('should set table name in command input', async () => {
    await createIndex(client, index)
    expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateTableCommand))

    const { input } = mockSend.mock.calls[0][0] as UpdateTableCommand
    expect(input.TableName).toEqual(index.tableName)
  })

  it('should set provisioned throughput in command input', async () => {
    await createIndex(client, index)
    expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateTableCommand))

    const { input } = mockSend.mock.calls[0][0] as UpdateTableCommand
    const indexUpdate = input.GlobalSecondaryIndexUpdates![0].Create!
    expect(indexUpdate).not.toBeUndefined()

    expect(indexUpdate.ProvisionedThroughput).toEqual({
      ReadCapacityUnits: index.throughput.readCapacityUnits,
      WriteCapacityUnits: index.throughput.writeCapacityUnits,
    })
  })

  it('should set partition key schema in command input', async () => {
    await createIndex(client, index)
    expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateTableCommand))

    const { input } = mockSend.mock.calls[0][0] as UpdateTableCommand
    const indexUpdate = input.GlobalSecondaryIndexUpdates![0].Create!
    expect(indexUpdate).not.toBeUndefined()

    const pkKeyElement = mapKeySchemaElement(index.keys.partitionKey.name, 'HASH')
    expect(indexUpdate.KeySchema).toEqual(expect.arrayContaining([pkKeyElement]))
  })

  it('should set sort key schema in command input', async () => {
    await createIndex(client, index)
    expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateTableCommand))

    const { input } = mockSend.mock.calls[0][0] as UpdateTableCommand
    const indexUpdate = input.GlobalSecondaryIndexUpdates![0].Create!
    expect(indexUpdate).not.toBeUndefined()

    const skKeyElement = mapKeySchemaElement(index.keys.sortKey!.name, 'RANGE')
    expect(indexUpdate.KeySchema).toEqual(expect.arrayContaining([skKeyElement]))
  })

  it('should set projection in command input', async () => {
    index.projection.type = ProjectionType.Include
    index.projection.attributes = ['FirstAttribute', 'SecondAttribute']

    await createIndex(client, index)
    expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateTableCommand))

    const { input } = mockSend.mock.calls[0][0] as UpdateTableCommand
    const indexUpdate = input.GlobalSecondaryIndexUpdates![0].Create!
    expect(indexUpdate).not.toBeUndefined()

    expect(indexUpdate.Projection).toEqual({
      ProjectionType: index.projection.type.toUpperCase(),
      NonKeyAttributes: index.projection.attributes,
    })
  })

  it('should pass output from command result', async () => {
    const mockResult = { message: 'Success' }
    mockSend.mockResolvedValueOnce(mockResult)

    await expect(createIndex(client, index)).resolves.toEqual(mockResult)
    expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateTableCommand))
  })
})
