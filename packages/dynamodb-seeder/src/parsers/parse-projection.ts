import assert from 'assert'
import { Projection, ProjectionType } from '../types'

const PROJECTION_TYPE_VALUES = Object.values(ProjectionType)

export default function parseProjection(data: unknown): Projection {
  assert(data && typeof data === 'object' && !Array.isArray(data), 'Projection must be an object')

  const { type, attributes } = data as Record<string, unknown>

  assert(typeof type === 'string', 'Projection type must be a string')
  assert(type.trim(), 'Projection type cannot be empty or whitespace')
  assert(PROJECTION_TYPE_VALUES.includes(type as ProjectionType), 'Projection type is invalid')

  assert(
    attributes == null || type === ProjectionType.Include,
    'Projection can only specify attributes with INCLUDE type',
  )

  if (attributes != null) {
    assert(
      Array.isArray(attributes) && attributes.every((attr) => typeof attr === 'string'),
      'Projection attributes must be an array of attribute names',
    )
  }

  return {
    type: type as ProjectionType,
    attributes: attributes ? (attributes as string[]) : undefined,
  }
}
