import { AttributeDefinition, KeySchemaElement, KeyType, ScalarAttributeType } from '@aws-sdk/client-dynamodb'
import { Attribute, AttributeType, KeySchema } from '../types'

export function mapKeyAttributes(keys: KeySchema): AttributeDefinition[] {
  const attributes: AttributeDefinition[] = [mapAttributeDefinition(keys.partitionKey)]

  if (keys.sortKey) {
    attributes.push(mapAttributeDefinition(keys.sortKey))
  }

  return attributes
}

export function mapKeySchema(keys: KeySchema): KeySchemaElement[] {
  const elements: KeySchemaElement[] = [mapKeySchemaElement(keys.partitionKey.name, 'HASH')]

  if (keys.sortKey) {
    elements.push(mapKeySchemaElement(keys.sortKey.name, 'RANGE'))
  }

  return elements
}

export function mapKeySchemaElement(name: string, type: KeyType): KeySchemaElement {
  return {
    AttributeName: name,
    KeyType: type,
  }
}

export function mapAttributeDefinition(attribute: Attribute): AttributeDefinition {
  return {
    AttributeName: attribute.name,
    AttributeType: mapAttributeType(attribute.type),
  }
}

export function mapAttributeType(type: AttributeType): ScalarAttributeType {
  switch (type) {
    case AttributeType.Binary:
      return 'B'
    case AttributeType.Number:
      return 'N'
    case AttributeType.String:
      return 'S'
  }
}
