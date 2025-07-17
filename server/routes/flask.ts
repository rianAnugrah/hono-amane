import { Hono } from 'hono'
import { env } from '../../config/env'

const flask = new Hono()



flask.get('/hello', (c) => {
  return c.json({ message: 'Hello from Flask route!' })
})

flask.post('/employee', async (c) => {
  let body: Record<string, unknown> | null = null;
  try {
    body = await c.req.json()
    console.log('[POST /employee] Request body:', body)

    const res = await fetch('https://flask-api.hcml.co.id/get-employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': env.X_API_KEY,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    console.log('[POST /employee] Response from Flask API:', data)
    return c.json(data, { status: res.status })
  } catch (error) {
    console.error('[POST /employee] Error:', error)
    return c.json({
      error: true,
      message: 'Failed to fetch employee data',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error && error.stack ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      requestBody: body || null
    }, { status: 500 })
  }
})


export default flask
