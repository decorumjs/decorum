import { green, red } from 'chalk'
import { ArgumentsCamelCase } from 'yargs'
import resolveFiles from '../helpers/resolve-files'
import loadYamlFile from '../loaders/load-yaml-file'
import parseSeedData from '../parsers/parse-seed-data'

export type LintArgs = {
  files: string[]
  [key: string]: unknown
}

export async function lint(args: ArgumentsCamelCase<LintArgs>): Promise<void> {
  // Resolve all file patterns via glob, flatten to single array
  const matchingFilenames = await resolveFiles(...args.files)

  // Attempt to load and parse each file for linting
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

  // If lint failed, set the exit code to 1 otherwise default to 0
  if (didFailLint) {
    process.exitCode = 1
  }
}

function logLintSuccess(filename: string) {
  const successString = green('OK')
  console.log(`${filename} - ${successString}`)
}

function logLintError(filename: string, message: string) {
  const errorString = red(`ERROR: ${message}`)
  console.log(`${filename} - ${errorString}`)
}

export default {
  command: 'lint [options] <files..>',
  describe: 'Lints data files for errors',
  aliases: ['validate'],
  builder: {},
  handler: lint,
}
