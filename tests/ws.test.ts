import { describe, expect, it } from 'vitest'
import { createWebsocket, getServerBaseURL } from '../src/ws'

describe('websocket', async () => {
  const baseURL = await getServerBaseURL({ getServerPort: () => 3000 } as any)
  const { ping, onReceived } = await createWebsocket(baseURL)

  it('connect', async () => {
    expect(true).toBe(true)
  })

  it('ping', async () => {
    onReceived(({ type }) => {
      if (type === 'pong')
        expect(type).toBe('pong')
    })

    ping()
  })
})
