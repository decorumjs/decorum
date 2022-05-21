import { ArgumentsCamelCase } from 'yargs'

type ValidateArgs = {
  port: number
  [key: string]: unknown
}

export default {
  command: 'validate [files]',
  describe: 'Validates one or more seed data files',
  builder: {
    port: {
      describe: 'port for something',
      default: 9001,
    },
  },
  handler,
}

function handler(args: ArgumentsCamelCase<ValidateArgs>): Promise<void> {
  console.log('validate')
  const keys = Object.keys(args)
  for (let i = 0; i < keys.length; i++) {
    const value = args[keys[i]]
    console.log(`arg.${keys[i]} = ${value} (${typeof value})`)
  }
  return Promise.resolve()
}
