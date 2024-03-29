import WebSocket from 'ws'
import { defu } from 'defu'
import { destr } from 'destr'
import type { Message, TodosContext, WS } from './types'
import 'dotenv/config'

interface CreateWebsocketOptions {
  immediate: boolean
  onConnected?: (ws: WS) => void
  onReceived?: (ws: WS, message: Message) => void
}

const decodeMessage = (message: string) => destr<Message>(message)
const defineRequest = (type: Message['type'], data?: any): string => JSON.stringify({ type, data })

const resolveOptions = (options: Partial<CreateWebsocketOptions> = {}) => defu(options, { immediate: true }) as CreateWebsocketOptions

export async function getServerBaseURL(ctx: TodosContext) {
  const port = await ctx.getServerPort()
  return `ws://localhost:${port}/api/ws`
}

export async function createWebsocket(url: string, rawOptions: Partial<CreateWebsocketOptions> = {}): Promise<WS> {
  let ws: WebSocket | undefined
  const _cbs: ((message: Message) => void)[] = []
  const options = resolveOptions(rawOptions)

  const r = {
    ws,
    connect,
    close,
    ping,
    put,
    onReceived,
  }

  async function connect(): Promise<void> {
    if (ws)
      close()

    ws = new WebSocket(url)

    ws.on('message', (data) => {
      const message = decodeMessage(data.toString())
      _cbs.forEach(cb => cb(message))
    })

    return new Promise((resolve, reject) => {
      ws!.on('open', (event: any) => {
        options.onConnected?.(r)
        resolve(event)
      })

      ws!.on('error', reject)
    })
  }

  function close() {
    ws?.close()
  }

  function onReceived(cb: (message: Message) => void) {
    _cbs.push(cb)
  }

  function ping() {
    ws?.send(defineRequest('ping'))
  }

  function put(domain: 'comments', data: any) {
    ws?.send(defineRequest(`put:${domain}`, data))
  }

  if (options.onReceived)
    _cbs.push(m => options.onReceived?.(r, m))

  if (options.immediate)
    await connect()

  return r
}
