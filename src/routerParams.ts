import type { Static, TSchema } from '@sinclair/typebox'
import { createError, H3Event, getRouterParams } from 'h3'
import { betterAjvErrors } from '@apideck/better-ajv-errors'
import type { useValidatorOptions } from './utils'
import { useValidator } from './utils'

export function validateRouterParams<T extends TSchema> (event: H3Event, schema: T, options: useValidatorOptions = { includeAjvFormats: false, allowCoerceTypes: false }) {
  const query = getRouterParams(event)
  const validate = useValidator(options).compile(schema)

  if (!validate(query)) {
    const betterErrors = betterAjvErrors({ schema, data: query, errors: validate.errors, basePath: 'query' })
    throw createError({ statusCode: 400, statusMessage: betterErrors[0].message })
  }

  return query as Static<T>
}
