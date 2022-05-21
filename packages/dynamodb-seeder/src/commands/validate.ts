import { green, red } from 'chalk'
import { ArgumentsCamelCase } from 'yargs'
import resolveFiles from '../helpers/resolve-files'
import loadYamlFile from '../loaders/load-yaml-file'
import parseSeedData from '../parsers/parse-seed-data'

export type ValidateArgs = {
  files: string[]
  [key: string]: unknown
}

export async function validate(args: ArgumentsCamelCase<ValidateArgs>): Promise<void> {
  const files = await resolveFiles(...args.files)
  for (const filename of files) {
    try {
      const doc = await loadYamlFile(filename)
      parseSeedData(doc)
      console.log(`${filename} - ${green('PASS')}`)
    } catch ({ message }) {
      console.log(`${filename} - ${red('FAIL')}`)
      console.error(red(`ERROR: ${message}`))
      process.exitCode = 1
    }
  }
}

export default {
  command: 'validate <files..>',
  describe: 'Validates one or more seed data files',
  builder: {},
  handler: validate,
}
