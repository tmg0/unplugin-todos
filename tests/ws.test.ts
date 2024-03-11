import { describe, expect, it } from 'vitest'
import { createWebsocket, getServerBaseURL } from '../src/ws'
import { createInternalContext } from '../src/context'

describe('websocket', async () => {
  const ctx = createInternalContext({} as any)
  const baseURL = await getServerBaseURL(ctx)
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
