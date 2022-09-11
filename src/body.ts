import type { Static, TSchema } from '@sinclair/typebox'
import { createError, useBody, CompatibilityEvent } from 'h3'
import { betterAjvErrors } from '@apideck/better-ajv-errors'
import { useValidator } from './utils'

export async function validateBody<T extends TSchema> (event: CompatibilityEvent, schema: T) {
  const body = await useBody(event)
  const validate = useValidator().compile(schema)

  if (!validate(body)) {
    const betterErrors = betterAjvErrors({ schema, data: body, errors: validate.errors, basePath: 'body' })
    throw createError({ statusCode: 400, statusMessage: betterErrors[0].message })
  }

  return body as Static<T>
}

/** @deprecated Use `validateBody` */
/* c8 ignore next */
export const useValidatedBody = validateBody
