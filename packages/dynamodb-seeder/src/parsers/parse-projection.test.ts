import { ProjectionType } from '../types'
import parseProjection from './parse-projection'

describe('parseProjection() function', () => {
  let data: Record<string, unknown>

  beforeEach(() => {
    data = {
      type: ProjectionType.All,
    }
  })

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['boolean', true],
    ['number', 1],
    ['empty', ''],
    ['string', 'test'],
    ['array', []],
  ])('should throw error when `data` is %s', (_, value) => {
    expect(() => parseProjection(value)).toThrowError(/projection must be an object/i)
  })

  describe('type property', function () {
    it('should return value from data', () => {
      const projection = parseProjection(data)
      expect(projection.type).toEqual(data.type)
    })

    it.each([
      ['undefined', undefined, /projection type must be a string/i],
      ['null', undefined, /projection type must be a string/i],
      ['boolean', true, /projection type must be a string/i],
      ['float', 3.14, /projection type must be a string/i],
      ['array', [], /projection type must be a string/i],
      ['object', {}, /projection type must be a string/i],
      ['empty', '', /projection type cannot be empty or whitespace/i],
      ['whitespace', ' ', /projection type cannot be empty or whitespace/i],
      ['invalid', 'test', /projection type is invalid/i],
    ])('should throw error when `type` is %s', (_, value, errorPattern) => {
      data.type = value
      expect(() => parseProjection(data)).toThrowError(errorPattern)
    })
  })

  describe('attributes array', () => {
    beforeEach(() => {
      data.type = ProjectionType.Include
      data.attributes = ['first', 'second', 'third']
    })

    it('should return value from data', () => {
      const projection = parseProjection(data)
      expect(projection.attributes).toEqual(data.attributes)
    })

    it.each([ProjectionType.All, ProjectionType.KeysOnly])(
      "should throw when `attributes` are specified and type is '%s'",
      (value) => {
        data.type = value
        expect(() => parseProjection(data)).toThrowError(/projection can only specify attributes with \w+ type/i)
      },
    )
  })
})
