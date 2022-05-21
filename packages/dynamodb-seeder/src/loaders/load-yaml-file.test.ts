import fs from 'fs'
import yaml from 'js-yaml'

import loadYamlFile from './load-yaml-file'

describe('loadYamlFile() function', () => {
  let mockReadFile: jest.SpyInstance
  let mockYamlLoad: jest.SpyInstance
  const mockContents = yaml.dump({ tables: [] })

  beforeEach(() => {
    jest.clearAllMocks()

    mockReadFile = jest.spyOn(fs, 'readFile')
    mockYamlLoad = jest.spyOn(yaml, 'load')
    mockReadFile.mockImplementation((filename, encoding, cb) => cb(null, mockContents))
  })

  it('calls readFile() with filename provided', async () => {
    const filename = 'test.yml'
    await loadYamlFile(filename)

    expect(mockReadFile).toHaveBeenCalledWith(filename, 'utf8', expect.any(Function))
  })

  it('call YAML load() with file contents', async () => {
    const filename = 'test.yml'
    await loadYamlFile(filename)
    expect(mockYamlLoad).toHaveBeenCalledWith(mockContents, { filename })
  })

  it('returns the YAML document loaded from file', async () => {
    const result = await loadYamlFile('test.yml')
    expect(result).toEqual(yaml.load(mockContents))
  })

  it('throws error when readFile() fails', async () => {
    const err = new Error()
    mockReadFile.mockImplementationOnce((filename, encoding, cb) => cb(err, null))

    await expect(loadYamlFile('test.yml')).rejects.toThrowError(err)
  })

  it('throws error when YAML load() fails', async () => {
    const err = new Error()
    mockYamlLoad.mockImplementationOnce(() => {
      throw err
    })

    await expect(loadYamlFile('test.yml')).rejects.toThrowError(err)
  })
})
