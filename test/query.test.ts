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

  it('returns 200 OK if query matches validation schema', async () => {
    app.use('/validate', eventHandler(req => validateQuery(req, querySchema)))

    const res = await request.get('/validate?required')

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
})
