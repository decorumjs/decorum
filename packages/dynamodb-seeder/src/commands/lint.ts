import { green, red, white } from 'chalk'
import { ArgumentsCamelCase } from 'yargs'
import resolveFiles from '../helpers/resolve-files'
import loadYamlFile from '../loaders/load-yaml-file'
import parseSeedData from '../parsers/parse-seed-data'

export type LintArgs = {
  files: string[]
  [key: string]: unknown
}

export async function lint(args: ArgumentsCamelCase<LintArgs>): Promise<void> {
  const matchingFilenames = await resolveFiles(...args.files)

  let didFailLint = false
  for (const filename of matchingFilenames) {
    try {
      const contents = await loadYamlFile(filename)
      parseSeedData(contents)
      logLintSuccess(filename)
    } catch ({ message }) {
      logLintError(filename, message as string)
      didFailLint = true
    }
  }

  if (didFailLint) {
    process.exitCode = 1
  }
}

function logLintSuccess(filename: string) {
  const successString = green('OK')
  console.log(`${white(filename)} - ${successString}`)
}

function logLintError(filename: string, message: string) {
  const errorString = red(`ERROR: ${message}`)
  console.log(`${white(filename)} - ${errorString}`)
}

export default {
  command: 'lint [options] <files..>',
  describe: 'Lints data files for errors',
  aliases: ['validate'],
  builder: {},
  handler: lint,
}
