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

  let didFail = false
  for (const filename of files) {
    try {
      const doc = await loadYamlFile(filename)
      parseSeedData(doc)
      console.log(`${filename} - ${green('OK')}`)
    } catch ({ message }) {
      const failMessage = `ERROR: ${message}`
      console.log(`${filename} - ${red(failMessage)}`)
      didFail = true
    }
  }

  process.exitCode = didFail ? 1 : 0
}

export default {
  command: 'validate <files..>',
  describe: 'Validates one or more seed data files',
  builder: {},
  handler: validate,
}
