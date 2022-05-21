import { ArgumentsCamelCase } from 'yargs'
import resolveFiles from '../helpers/resolve-files'
import { loadYamlDoc } from '../loaders/yaml-loader'

export type ValidateArgs = {
  files: string[]
  [key: string]: unknown
}

export async function validate(args: ArgumentsCamelCase<ValidateArgs>): Promise<void> {
  const files = await resolveFiles(...args.files)
  for (const filename of files) {
    const doc = await loadYamlDoc(filename)
    console.log(JSON.stringify(doc, null, 2))
  }
}

export default {
  command: 'validate <files..>',
  describe: 'Validates one or more seed data files',
  builder: {},
  handler: validate,
}
