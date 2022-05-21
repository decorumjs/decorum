export type SeedData = {
  tables?: TableDefinition[]
  indexes?: IndexDefinition[]
  items?: ItemArray[]
}

export type TableDefinition = {
  name: string
  throughput: Throughput
  keys: KeySchema
}

export type IndexDefinition = {
  name: string
  tableName: string
  throughput: Throughput
  keys: KeySchema
  projection: Projection
}

export type ItemArray = {
  tableName: string
  data: Item[]
}

export type Item = {
  [key: string]: unknown
}

export type Throughput = {
  readCapacityUnits: number
  writeCapacityUnits: number
}

export type KeySchema = {
  partitionKey: AttributeDefinition
  sortKey?: AttributeDefinition
}

export type AttributeDefinition = {
  name: string
  type: AttributeType
}

export type Projection = {
  type: ProjectionType
  attributes?: string[]
}

export enum AttributeType {
  String = 'string',
  Number = 'number',
  Binary = 'binary',
}

export enum ProjectionType {
  All = 'all',
  KeysOnly = 'keys_only',
  Include = 'include',
}
