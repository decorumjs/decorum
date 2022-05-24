import { green, red, white, yellow } from 'chalk'
import { ArgumentsCamelCase } from 'yargs'
import { SeedDataFile } from '../types'
import resolveFiles from '../helpers/resolve-files'
import loadYamlFile from '../loaders/load-yaml-file'
import parseSeedData from '../parsers/parse-seed-data'
import { aggregateCollections, aggregateIndexes, aggregateTables } from '../helpers/aggregate-data'

export type SeedArgs = {
  files: string[]
  [key: string]: unknown
}

export async function seed(args: ArgumentsCamelCase<SeedArgs>): Promise<void> {
  const matchingFilenames = await resolveFiles(...args.files)

  let didFailLint = false
  const dataFiles: SeedDataFile[] = []

  for (const filename of matchingFilenames) {
    try {
      const contents = await loadYamlFile(filename)
      const data = parseSeedData(contents)
      dataFiles.push({ filename, data })
    } catch ({ message }) {
      logLintError(filename, message as string)
      didFailLint = true
    }
  }

  if (didFailLint) {
    process.exitCode = 1
    return
  }

  const allTables = aggregateTables(dataFiles.map((dataFile) => dataFile.data))
  const allIndexes = aggregateIndexes(dataFiles.map((dataFile) => dataFile.data))
  const allCollections = aggregateCollections(dataFiles.map((dataFile) => dataFile.data))

  const tableCounts = getKeyCounts(allTables, (table) => table.name)
  const indexCounts = getKeyCounts(allIndexes, (index) => `${index.tableName}#${index.name}`)

  for (const [tableName, count] of Object.entries(tableCounts)) {
    if (count > 1) {
      logWarning(`Table '${white(tableName)}' is defined more than once`)
    }
  }

  for (const [tableIndexName, count] of Object.entries(indexCounts)) {
    const [tableName, indexName] = tableIndexName.split('#')
    if (count > 1) {
      logWarning(`Index '${white(indexName)}' on table '${white(tableName)}' is defined more than once`)
    }
  }

  return Promise.resolve()
}

function logLintError(filename: string, message: string) {
  const errorString = red(`ERROR: ${message}`)
  console.log(`${white(filename)} - ${errorString}`)
}

function logWarning(message: string) {
  const warningString = yellow('WARN:')
  console.log(`${warningString} ${message}`)
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
