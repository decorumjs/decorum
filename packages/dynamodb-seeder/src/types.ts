export type SeedData = {
  tables?: TableDefinition[]
  indexes?: IndexDefinition[]
  items?: ItemArray[]
}

export type TableDefinition = {
  name: string
  throughput: ProvisionedThroughput
  keys: KeySchema
}

export type IndexDefinition = {
  name: string
  tableName: string
  throughput: ProvisionedThroughput
  keys: KeySchema
  projection: 'all' | 'keys_only' | string[]
}

export type ProvisionedThroughput = {
  readCapacityUnits: number
  writeCapacityUnits: number
}

export type KeySchema = {
  partitionKey: AttributeDefinition
  sortKey?: AttributeDefinition
}

export type AttributeDefinition = {
  name: string
  type: 'string' | 'number' | 'binary'
}

export type ItemArray = {
  tableName: string
  data: Item[]
}

export type Item = {
  [key: string]: unknown
}
