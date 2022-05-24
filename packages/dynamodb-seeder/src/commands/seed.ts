import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { green, red, yellow } from 'chalk'
import { ArgumentsCamelCase } from 'yargs'
import { SeedDataFile } from '../types'
import resolveFiles from '../helpers/resolve-files'
import loadYamlFile from '../loaders/load-yaml-file'
import parseSeedData from '../parsers/parse-seed-data'
import { aggregateCollections, aggregateIndexes, aggregateTables } from '../helpers/aggregate-data'
import { createIndex, createTable, AWSErrors } from '../dynamodb'

export type SeedArgs = {
  files: string[]
  endpoint: string
  region: string
  [key: string]: unknown
}

export async function seed(args: ArgumentsCamelCase<SeedArgs>): Promise<void> {
  // Resolve all file patterns via glob, flatten to single array
  const matchingFilenames = await resolveFiles(...args.files)

  const dataFiles: SeedDataFile[] = []

  logInfo('Validating data files...', false)

  // Attempt to load and parse all seed data files
  for (const filename of matchingFilenames) {
    try {
      const contents = await loadYamlFile(filename)
      const data = parseSeedData(contents)
      dataFiles.push({ filename, data })
    } catch ({ message }) {
      logError(`${message} (${filename})`)
      process.exitCode = 1
      return
    }
  }
  logInfo(green('OK'))

  // Flatten all tables, indexes, and item collections across all data files
  const allTables = aggregateTables(dataFiles.map((dataFile) => dataFile.data))
  const allIndexes = aggregateIndexes(dataFiles.map((dataFile) => dataFile.data))
  const allCollections = aggregateCollections(dataFiles.map((dataFile) => dataFile.data))

  // Tally the counts of each table and index
  const tableCounts = getKeyCounts(allTables, (table) => table.name)
  const indexCounts = getKeyCounts(allIndexes, (index) => `${index.tableName}#${index.name}`)

  // Warn if any table is defined more than once
  for (const [tableName, count] of Object.entries(tableCounts)) {
    if (count > 1) {
      logWarning(`Table '${tableName}' is defined more than once`)
    }
  }

  // Warn if any index is defined more than once (per table)
  for (const [tableIndexName, count] of Object.entries(indexCounts)) {
    const [tableName, indexName] = tableIndexName.split('#')
    if (count > 1) {
      logWarning(`Index '${indexName}' on table '${tableName}' is defined more than once`)
    }
  }

  const client = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      region: args.region,
      endpoint: args.endpoint,
    }),
  )

  // Seed each table to DynamoDB
  for (const table of allTables) {
    logInfo(`Seeding table '${table.name}'...`, false)
    try {
      await createTable(client, table)
      logInfo(green('OK'))
    } catch ({ name, message }) {
      if (name === AWSErrors.ResourceInUseException) {
        logInfo(yellow('EXISTS'))
      } else {
        logError(`${message} (${name})`)
      }
    }
  }

  // Seed each index to DynamoDB
  for (const index of allIndexes) {
    logInfo(`Seeding index '${index.name}' on table '${index.tableName}'...`, false)
    try {
      await createIndex(client, index)
      logInfo(green('OK'))
    } catch ({ name, message }) {
      logError(`${message} (${name})`)
    }
  }

  for (const collection of allCollections) {
  }

  return Promise.resolve()
}

function logInfo(message: string, newLine = true) {
  process.stdout.write(`${message}${newLine ? '\n' : ''}`)
}

function logWarning(message: string) {
  const warningString = yellow('WARN:')
  console.log(`${warningString} ${message}`)
}

function logError(message: string) {
  const errorString = red('ERROR:')
  console.log(`${errorString} ${message}`)
}

function getKeyCounts<T>(array: T[], keyFn: (value: T) => string): Record<string, number> {
  return array.reduce((counts, value) => {
    const key = keyFn(value)
    return {
      ...counts,
      [key]: (counts[key] ?? 0) + 1,
    }
  }, {} as Record<string, number>)
}

export default {
  command: 'seed [options] <files..>',
  describe: 'Seeds data files into DynamoDB',
  builder: {
    endpoint: {
      describe: 'DynamoDB endpoint',
      default: 'http://localhost:8000',
    },
    region: {
      describe: 'AWS region',
      default: 'us-east-1',
    },
  },
  handler: seed,
}
