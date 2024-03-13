import { useWebSocket } from '@vueuse/core'
import { destr } from 'destr'

export function useComments() {
  const comments = ref<any[]>([])

  const { status, data, send: _send } = useWebSocket(`ws://${location.host}/api/ws`, {
    autoReconnect: {
      retries: 3,
      delay: 5 * 1000,
    },
    heartbeat: {
      message: JSON.stringify({ type: 'ping' }),
      interval: 5 * 1000,
      pongTimeout: 1000,
    },
  })

  watch(data, (value) => {
    const json = destr<any>(value)

    if (status.value !== 'OPEN')
      return

    if (json.type === 'connected')
      refresh()

    if (json.type === 'put:comments')
      comments.value = json.data
  })

  function refresh() {
    send('get:comments')
  }

  function send(type: string, data?: any) {
    _send(JSON.stringify({ type, data }))
  }

  return {
    comments,
    status,
    refresh,
    send,
  }
}
