import type { Static, TSchema } from '@sinclair/typebox'
import { createError, H3Event, readBody } from 'h3'
import { betterAjvErrors } from '@apideck/better-ajv-errors'
import type { useValidatorOptions } from './utils'
import { useValidator } from './utils'

export async function validateBody<T extends TSchema> (event: H3Event, schema: T, options: useValidatorOptions = { includeAjvFormats: false, allowCoerceTypes: false }) {
  const body = await readBody(event)
  const validate = useValidator(options).compile(schema)

  if (!validate(body)) {
    const betterErrors = betterAjvErrors({ schema, data: body, errors: validate.errors, basePath: 'body' })
    throw createError({ statusCode: 400, statusMessage: betterErrors[0].message })
  }

  return body as Static<T>
}

/** @deprecated Use `validateBody` */
/* c8 ignore next */
export const useValidatedBody = validateBody
