import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { DescribeTableCommand, DescribeTableInput, DescribeTableOutput } from '@aws-sdk/client-dynamodb'

export default function describeTable(client: DynamoDBDocumentClient, tableName: string): Promise<DescribeTableOutput> {
  const params: DescribeTableInput = {
    TableName: tableName,
  }

  return client.send(new DescribeTableCommand(params))
}
