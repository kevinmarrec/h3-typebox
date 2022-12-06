import supertest, { SuperTest, Test } from 'supertest'
import { describe, beforeEach, it, expect } from 'vitest'
import { createApp, App, toNodeListener, eventHandler } from 'h3'
import { validateQuery, Type } from '../src'

describe('validateQuery', () => {
  let app: App
  let request: SuperTest<Test>

  beforeEach(() => {
    app = createApp({ debug: false })
    request = supertest(toNodeListener(app))
  })

  const querySchema = Type.Object({
    required: Type.String()
  })

  const querySchemaWithExtendedTypes = Type.Object({
    date: Type.String({ format: 'date' }),
    time: Type.String({ format: 'time' }),
    dateTime: Type.String({ format: 'date-time' })
  })

  const queryWithExtendedTypes = {
    date: '2018-11-13',
    time: '20:20:39+00:00',
    dateTime: '2018-11-13T20:20:39+00:00'
  }

  it('returns 200 OK if query matches validation schema', async () => {
    app.use('/validate', eventHandler(req => validateQuery(req, querySchema)))

    const res = await request.get('/validate?required')

    expect(res.status).toEqual(200)
  })

  it('returns 200 OK if query matches extended validation schema', async () => {
    app.use('/validate', eventHandler(req => validateQuery(req, querySchemaWithExtendedTypes, { includeAjvFormats: true })))

    const res = await request.get('/validate').query(queryWithExtendedTypes)

    expect(res.status).toEqual(200)
  })

  it('throws 400 Bad Request if query does not match validation schema', async () => {
    app.use('/validate', eventHandler(req => validateQuery(req, querySchema)))

    const res = await request.get('/validate')

    expect(res.status).toEqual(400)
    expect(res.body).toEqual(
      expect.objectContaining({
        statusMessage: "query must have required property 'required'"
      })
    )
  })

  it('throws 500 if no options for extended schema are present', async () => {
    app.use('/validate', eventHandler(req => validateQuery(req, querySchemaWithExtendedTypes)))

    const res = await request.get('/validate').query(queryWithExtendedTypes)

    expect(res.statusCode).toEqual(500)
  })

  it('throws 400 Bad Request if query does not match validation schema with extended schema options', async () => {
    app.use('/validate', eventHandler(req => validateQuery(req, querySchemaWithExtendedTypes, { includeAjvFormats: true })))

    const res = await request.get('/validate').query({ date: '2018-11-13T20:20:39+00:00', time: '20:20', dateTime: '2018-11-13T20:20:39' })

    expect(res.body.statusMessage).toEqual('property \'date\' must match format \'date\'')
    expect(res.statusCode).toEqual(400)
  })
})
