import { ArgumentsCamelCase } from 'yargs'
import resolveFiles from '../helpers/resolve-files'

export type ValidateArgs = {
  files: string[]
  [key: string]: unknown
}

export async function validate(args: ArgumentsCamelCase<ValidateArgs>): Promise<void> {
  const files = await resolveFiles(args.files)
  for (const filename of files) {
    console.log(filename)
  }
}

export default {
  command: 'validate <files..>',
  describe: 'Validates one or more seed data files',
  builder: {},
  handler: validate,
}
