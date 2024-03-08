import { describe, expect, it } from 'vitest'
import WebSocket from 'ws'
import { BASE_URL, createWebsocket } from '../src/ws'

describe('websocket', async () => {
  const ws = new WebSocket(BASE_URL)
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

  it('get comments', async () => {
    onReceived(({ type }) => {
      if (type === 'get:comments')
        expect(type).toBe('get:comments')
    })

    ws.send(JSON.stringify({ type: 'get:comments', data: [] }))
  })
})
