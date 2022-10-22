import type { Static, TSchema } from '@sinclair/typebox'
import { createError, getQuery, H3Event } from 'h3'
import { betterAjvErrors } from '@apideck/better-ajv-errors'
import { useValidator } from './utils'

export function validateQuery<T extends TSchema> (event: H3Event, schema: T) {
  const query = getQuery(event)
  const validate = useValidator().compile(schema)

  if (!validate(query)) {
    const betterErrors = betterAjvErrors({ schema, data: query, errors: validate.errors, basePath: 'query' })
    throw createError({ statusCode: 400, statusMessage: betterErrors[0].message })
  }

  return query as Static<T>
}

/** @deprecated Use `validateQuery` */
/* c8 ignore next */
export const useValidatedQuery = validateQuery
