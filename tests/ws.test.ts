import { describe, expect, it } from 'vitest'
import { BASE_URL, createWebsocket } from '../src/ws'

describe('websocket', async () => {
  const { ping, onReceived } = await createWebsocket(BASE_URL)

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
