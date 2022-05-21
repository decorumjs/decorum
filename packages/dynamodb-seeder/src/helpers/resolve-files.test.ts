import resolveFiles from './resolve-files'

describe('resolveFiles() function', () => {
  let mockGlob: jest.SpyInstance

  beforeEach(() => {
    jest.resetAllMocks()

    mockGlob = jest.fn((filename, cb) => cb(null, []))

    jest.mock('glob', () => ({
      default: mockGlob,
    }))
  })

  it('should', async () => {
    expect(mockGlob).toHaveBeenCalled()
  })
})
