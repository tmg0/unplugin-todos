import { ws } from './ws'

function syncComments() {
  ws.send([
    {
      id: './app.vue',
      type: 'line',
      original: '',
      start: 0,
      end: 0,
      line: 1,
    },
  ])
}

export const rpc = {
  syncComments,
}
