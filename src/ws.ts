import process from 'node:process'

import 'dotenv/config'

export const BASE_URL = `http://${process.env.HOST}:${process.env.NITRO_PORT}/_todos/api/ws`

let _ws: WebSocket

async function connect() {
  if (_ws)
    _ws.close()

  _ws = new WebSocket(BASE_URL)

  _ws.addEventListener('message', () => {
    // TODO: Status flow actions
  })

  await new Promise(resolve => _ws!.addEventListener('open', resolve))
}

function send(data: any) {
  _ws!.send(data)
}

function ping() {
  _ws!.send('ping')
}

export const ws = {
  connect,
  send,
  ping,
}

export function setupWS() {
  return ws.connect()
}
