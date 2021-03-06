#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { lintCommand, seedCommand } from './commands'

const environment = {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: require('../package.json').version,
}

// prettier-ignore
yargs(hideBin(process.argv))
  .scriptName('dynamodb-seeder')
  .version('version', environment.version)
  .usage('$0 <cmd> [args]')
  .command(lintCommand)
  .command(seedCommand)
  .demandCommand()
  .help()
  .argv
