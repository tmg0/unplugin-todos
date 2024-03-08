<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'
import { destr } from 'destr'

const comments = ref<any[]>([])

const { status, data, send } = useWebSocket('ws://localhost:3000/api/ws', {
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

  if (json.type === 'put:comments')
    comments.value = json.data
})

watch(status, (value) => {
  if (value === 'OPEN')
    send(JSON.stringify({ type: 'get:comments' }))
})
</script>

<template>
  <div>
    <div>
      unplugin-todos
    </div>

    {{ comments }}
  </div>
</template>
