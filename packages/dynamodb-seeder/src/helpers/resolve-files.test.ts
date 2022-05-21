import glob from 'glob'
import resolveFiles from './resolve-files'

jest.mock('glob', () => jest.fn((filename, cb) => cb(null, [filename])))

describe('resolveFiles() function', () => {
  let mockGlob: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    mockGlob = glob as unknown as jest.SpyInstance
  })

  it('should call glob() with single file pattern', async () => {
    const pattern = '*.ts'
    await resolveFiles(pattern)

    expect(glob).toHaveBeenCalledWith(pattern, expect.any(Function))
  })

  it('should call glob() with array of file patterns', async () => {
    const patterns = ['*.ts', '*.js']
    await resolveFiles(...patterns)

    patterns.forEach((filename) => {
      expect(glob).toHaveBeenCalledWith(filename, expect.any(Function))
    })
  })

  it('should throw error when glob() fails', async () => {
    const err = new Error()
    mockGlob.mockImplementationOnce((filename, cb) => cb(err, []))

    await expect(resolveFiles('')).rejects.toThrow(err)
  })

  it('should flatten glob() matches to single array', async () => {
    const expectedMatches = ['test-1.ts', 'test-2.ts', 'test-3.ts']

    mockGlob
      .mockImplementationOnce((filename, cb) => cb(null, expectedMatches.slice(0, 1)))
      .mockImplementationOnce((filename, cb) => cb(null, expectedMatches.slice(1)))

    await expect(resolveFiles('first', 'second')).resolves.toEqual(expectedMatches)
  })

  it('should return unique filenames (de-dupe)', async () => {
    const expectedMatches = ['test-1.ts', 'test-2.ts', 'test-3.ts']

    mockGlob
      .mockImplementationOnce((filename, cb) => cb(null, expectedMatches.slice(0, 2)))
      .mockImplementationOnce((filename, cb) => cb(null, expectedMatches.slice(1, 3)))

    await expect(resolveFiles('first', 'second')).resolves.toEqual(expectedMatches)
  })
})
