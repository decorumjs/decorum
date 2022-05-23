import { green, red, white } from 'chalk'
import { ArgumentsCamelCase } from 'yargs'
import resolveFiles from '../helpers/resolve-files'
import loadYamlFile from '../loaders/load-yaml-file'
import parseSeedData from '../parsers/parse-seed-data'

const OK_STRING = green('OK')

export type LintArgs = {
  files: string[]
  [key: string]: unknown
}

export async function lint(args: ArgumentsCamelCase<LintArgs>): Promise<void> {
  const files = await resolveFiles(...args.files)

  let didFail = false
  for (const filename of files) {
    try {
      const doc = await loadYamlFile(filename)
      parseSeedData(doc)
      logSuccess(filename)
    } catch ({ message }) {
      logFailure(filename, message as string)
      didFail = true
    }
  }

  process.exitCode = didFail ? 1 : 0
}

function logSuccess(filename: string) {
  console.log(`${white(filename)} - ${OK_STRING}`)
}

function logFailure(filename: string, message: string) {
  const errorString = red(`ERROR: ${message}`)
  console.log(`${white(filename)} - ${errorString}`)
}

export default {
  command: 'lint <files..>',
  describe: 'Lints data files for errors',
  aliases: ['validate'],
  builder: {},
  handler: lint,
}
