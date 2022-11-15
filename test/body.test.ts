import supertest, { SuperTest, Test } from 'supertest'
import { describe, beforeEach, it, expect } from 'vitest'
import { createApp, App, toNodeListener, eventHandler } from 'h3'
import { validateBody, Type } from '../src'

describe('validateBody', () => {
  let app: App
  let request: SuperTest<Test>

  beforeEach(() => {
    app = createApp({ debug: false })
    request = supertest(toNodeListener(app))
  })

  const bodySchema = Type.Object({
    optional: Type.Optional(Type.String()),
    required: Type.Boolean()
  })

  const bodySchemaWithExtendedTypes = Type.Object({
    date: Type.String({ format: 'date' }),
    time: Type.String({ format: 'time' }),
    dateTime: Type.String({ format: 'date-time' })
  })

  const bodyWithExtendedTypes = {
    date: '2018-11-13',
    time: '20:20:39+00:00',
    dateTime: '2018-11-13T20:20:39+00:00'
  }

  it('returns 200 OK if body matches validation schema', async () => {
    app.use('/validate', eventHandler(async req => await validateBody(req, bodySchema)))

    const res = await request.post('/validate').send({ required: true })

    expect(res.statusCode).toEqual(200)
  })

  it('returns 200 OK if body matches extended validation schema', async () => {
    app.use('/validate', eventHandler(async req => await validateBody(req, bodySchemaWithExtendedTypes, { includeAjvFormats: true })))

    const res = await request.post('/validate').send(bodyWithExtendedTypes)

    expect(res.statusCode).toEqual(200)
  })

  it('throws 400 Bad Request if body does not match validation schema', async () => {
    app.use('/validate', eventHandler(async req => await validateBody(req, bodySchema)))

    const res = await request.post('/validate').send({})

    expect(res.status).toEqual(400)
    expect(res.body).toEqual(
      expect.objectContaining({
        statusMessage: "body must have required property 'required'"
      })
    )
  })

  it('throws 500 if no options for extended schema are present', async () => {
    app.use('/validate', eventHandler(async req => await validateBody(req, bodySchemaWithExtendedTypes)))

    const res = await request.post('/validate').send(bodyWithExtendedTypes)

    expect(res.statusCode).toEqual(500)
  })

  it('throws 400 Bad Request if body does not match validation schema with extended schema options', async () => {
    app.use('/validate', eventHandler(async req => await validateBody(req, bodySchemaWithExtendedTypes, { includeAjvFormats: true })))

    const res = await request.post('/validate').send({ date: '2018-11-13T20:20:39+00:00', time: '20:20', dateTime: '2018-11-13T20:20:39' })

    expect(res.body.statusMessage).toEqual('property \'date\' must match format \'date\'')
    expect(res.statusCode).toEqual(400)
  })
})
