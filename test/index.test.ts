import supertest, { SuperTest, Test } from 'supertest'
import { describe, beforeEach, it, expect } from 'vitest'
import { createApp, App } from 'h3'
import { useValidatedBody, Type } from '../src'

describe('useValidatedBody', () => {
  let app: App
  let request: SuperTest<Test>

  beforeEach(() => {
    app = createApp({ debug: false })
    request = supertest(app)
  })

  const bodySchema = Type.Object({
    optional: Type.Optional(Type.String()),
    required: Type.Boolean()
  })

  it('returns 200 OK if body matches validation schema', async () => {
    app.use('/validate', async req => await useValidatedBody(req, bodySchema))
    const res = await request.post('/validate').send({ required: true })

    expect(res.status).toEqual(200)
  })

  it('throws 400 Bad Request if body does not match validation schema', async () => {
    app.use('/validate', async req => await useValidatedBody(req, bodySchema))
    const res = await request.post('/validate').send({})

    expect(res.status).toEqual(400)
    expect(res.body).toEqual(
      expect.objectContaining({
        statusMessage: "body must have required property 'required'"
      })
    )
  })
})
