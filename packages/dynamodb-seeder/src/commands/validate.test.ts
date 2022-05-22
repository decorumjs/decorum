import { ArgumentsCamelCase } from 'yargs'
import { validate, ValidateArgs } from './validate'
import resolveFiles from '../helpers/resolve-files'
import loadYamlFile from '../loaders/load-yaml-file'
import parseSeedData from '../parsers/parse-seed-data'

jest.mock('../helpers/resolve-files', () => jest.fn((...args) => Promise.resolve([...args])))
jest.mock('../loaders/load-yaml-file', () => jest.fn(() => Promise.resolve({})))
jest.mock('../parsers/parse-seed-data', () => jest.fn(() => ({})))

describe('validate command', () => {
  let args: ArgumentsCamelCase<ValidateArgs>
  let mockConsoleLog: jest.SpyInstance
  let mockResolveFiles: jest.SpyInstance
  let mockLoadYamlFile: jest.SpyInstance
  let mockParseSeedData: jest.SpyInstance

  beforeEach(() => {
    args = {
      _: [],
      $0: 'dynamodb-seeder validate',
      files: ['first.yml', 'second.yml'],
    }

    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation()

    mockResolveFiles = resolveFiles as unknown as jest.SpyInstance
    mockLoadYamlFile = loadYamlFile as unknown as jest.SpyInstance
    mockParseSeedData = parseSeedData as unknown as jest.SpyInstance
  })

  afterEach(() => {
    mockConsoleLog.mockRestore()
  })

  it('should resolve all file patterns provided', async () => {
    await validate(args)
    expect(mockResolveFiles).toHaveBeenCalledWith(...args.files)
  })

  it('should load each data file', async () => {
    await validate(args)
    for (const filename of args.files) {
      expect(mockLoadYamlFile).toHaveBeenCalledWith(filename)
    }
  })

  it('should parse each data file', async () => {
    const mockDocs = args.files.map(() => ({ tables: [], indexes: [], collections: [] }))
    mockDocs.forEach((doc) => mockLoadYamlFile.mockReturnValueOnce(doc))

    await validate(args)

    mockDocs.forEach((doc) => expect(mockParseSeedData).toHaveBeenCalledWith(doc))
  })

  it('should log `OK` on success', async () => {
    await validate(args)
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(/OK.*$/i))
  })

  it('should log `ERROR` on failure', async () => {
    const err = new Error('Invalid data file')
    mockParseSeedData.mockImplementationOnce(() => {
      throw err
    })

    await validate(args)
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(/ERROR:.*$/i))
  })

  it('should set process.exitCode to non-zero on failure', async () => {
    const err = new Error('Invalid data file')
    mockParseSeedData.mockImplementationOnce(() => {
      throw err
    })

    await validate(args)
    expect(process.exitCode).not.toEqual(0)
  })
})
