import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { server } from '../mocks/server'

// Start server before all tests
beforeAll(() => server.listen())

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Clean up after all tests
afterAll(() => server.close())

describe('MSW Setup', () => {
  it('should be configured correctly', () => {
    expect(server).toBeDefined()
  })

  it('should handle auth endpoints', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@clause.com',
        password: '123456',
      }),
    })

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data.user).toBeDefined()
    expect(data.token).toBeDefined()
  })
})

