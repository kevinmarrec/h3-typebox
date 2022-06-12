import type { Static, TSchema } from '@sinclair/typebox'
import { createError, CompatibilityEvent, useQuery } from 'h3'
import { useValidator } from './utils'

export function useValidatedQuery<T extends TSchema> (event: CompatibilityEvent, schema: T) {
  const query = useQuery(event)
  const validate = useValidator().compile(schema)

  if (!validate(query)) {
    throw createError({ statusCode: 400, statusMessage: `query ${validate.errors[0].message}` })
  }

  return query as Static<T>
}
