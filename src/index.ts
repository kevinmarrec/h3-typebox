import type { Static, TSchema } from '@sinclair/typebox'
import { createError, useBody, CompatibilityEvent } from 'h3'
import Ajv from 'ajv'

const ajv = new Ajv({
  keywords: ['kind', 'modifier']
})

export async function useValidatedBody<T extends TSchema> (event: CompatibilityEvent, schema: T) {
  const body = await useBody(event)
  const validate = ajv.compile(schema)

  if (!validate(body)) {
    throw createError({ statusCode: 400, statusMessage: `body ${validate.errors[0].message}` })
  }

  return body as Static<T>
}

export { Type } from '@sinclair/typebox'
