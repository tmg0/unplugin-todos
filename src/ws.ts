import process from 'node:process'
import WebSocket from 'ws'
import { defu } from 'defu'
import { destr } from 'destr'
import 'dotenv/config'

interface Message {
  type: 'ping' | 'pong' | 'connected' | 'put:comments'
  data?: any
}

export const BASE_URL = `ws://localhost:${process.env.NITRO_PORT ?? 3000}/api/ws`

interface CreateWebsocketOptions {
  immediate: boolean
}

const decodeMessage = (message: string) => destr<Message>(message)
const defineRequest = (type: Message['type'], data?: any): string => JSON.stringify({ type, data })

const resolveOptions = (options: Partial<CreateWebsocketOptions> = {}) => defu(options, { immediate: true }) as CreateWebsocketOptions

export async function createWebsocket(url: string, rawOptions?: CreateWebsocketOptions) {
  let ws: WebSocket | undefined
  let _cb: ((message: Message) => void) | undefined
  const options = resolveOptions(rawOptions)

  async function connect(): Promise<void> {
    if (ws)
      close()

    ws = new WebSocket(url)

    ws.on('message', (data) => {
      const message = decodeMessage(data.toString())
      _cb?.(message)
    })

    return new Promise((resolve, reject) => {
      ws!.on('open', resolve)
      ws!.on('error', reject)
    })
  }

  function close() {
    ws?.close()
  }

  function onReceived(cb: (message: Message) => void) {
    _cb = cb
  }

  function ping() {
    ws?.send(defineRequest('ping'))
  }

  function put(domain: 'comments', data: any) {
    ws?.send(defineRequest(`put:${domain}`, data))
  }

  if (options.immediate)
    await connect()

  return {
    ws,
    connect,
    close,
    ping,
    put,
    onReceived,
  }
}
