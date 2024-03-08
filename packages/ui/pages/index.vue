<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const { status, data } = useWebSocket('ws://localhost:3000/api/ws', {
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
</script>

<template>
  <div>
    <div>
      unplugin-todos
    </div>

    {{ status }}
    {{ data }}
  </div>
</template>
