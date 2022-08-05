import type { Static, TSchema } from '@sinclair/typebox'
import { createError, CompatibilityEvent, useQuery } from 'h3'
import { useValidator } from './utils'

export function validateQuery<T extends TSchema> (event: CompatibilityEvent, schema: T) {
  const query = useQuery(event)
  const validate = useValidator().compile(schema)

  if (!validate(query)) {
    throw createError({ statusCode: 400, statusMessage: `query ${validate.errors[0].message}` })
  }

  return query as Static<T>
}

/** @deprecated Use `validateQuery` */
/* c8 ignore next */
export const useValidatedQuery = validateQuery
