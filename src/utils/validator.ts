import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Value } from '@sinclair/typebox/value'

export interface useValidatorOptions {
  includeAjvFormats: boolean,
  allowCoerceTypes: boolean
}

let instance: Ajv
let instanceWithFormats: Ajv

function schemaOf (schemaOf: string, value: unknown, schema: unknown) {
  switch (schemaOf) {
    case 'Constructor':
      return TypeGuard.TConstructor(schema) && Value.Check(schema, value) // not supported
    case 'Function':
      return TypeGuard.TFunction(schema) && Value.Check(schema, value) // not supported
    case 'Date':
      return TypeGuard.TDate(schema) && Value.Check(schema, value)
    case 'Promise':
      return TypeGuard.TPromise(schema) && Value.Check(schema, value) // not supported
    case 'Uint8Array':
      return TypeGuard.TUint8Array(schema) && Value.Check(schema, value)
    case 'Undefined':
      return TypeGuard.TUndefined(schema) && Value.Check(schema, value) // not supported
    case 'Void':
      return TypeGuard.TVoid(schema) && Value.Check(schema, value)
    default:
      return false
  }
}

export function useValidator (options?: useValidatorOptions) {
  if (options?.includeAjvFormats) {
    if (!instanceWithFormats) {
      instanceWithFormats = addFormats(new Ajv({
        keywords: ['kind', 'modifier'],
        coerceTypes: options?.allowCoerceTypes
      }), {
        mode: 'fast',
        formats: [
          'date-time',
          'time',
          'date',
          'email',
          'uri',
          'uri-reference'
        ] // Only adding formats that are simplified by fast mode and are "relatively" safe. See https://ajv.js.org/guide/formats.html for details.
      })
        .addKeyword({ type: 'object', keyword: 'instanceOf', validate: schemaOf })
        .addKeyword({ type: 'null', keyword: 'typeOf', validate: schemaOf })
        .addKeyword('exclusiveMinimumTimestamp')
        .addKeyword('exclusiveMaximumTimestamp')
        .addKeyword('minimumTimestamp')
        .addKeyword('maximumTimestamp')
        .addKeyword('minByteLength')
        .addKeyword('maxByteLength')
    }
    return instanceWithFormats
  } else if (!instance) {
    instance = new Ajv({
      keywords: ['kind', 'modifier']
    })
  }
  return instance
}
