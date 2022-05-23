import { ArgumentsCamelCase } from 'yargs'

export type SeedArgs = {
  files: string[]
  [key: string]: unknown
}

export async function seed(args: ArgumentsCamelCase<SeedArgs>): Promise<void> {
  return Promise.resolve()
}

export default {
  command: 'seed <files..> [options]',
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
