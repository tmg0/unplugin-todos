<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const { status, data } = useWebSocket('ws://localhost:3000/api/ws', {
  autoReconnect: true,
  heartbeat: {
    message: 'ping',
    interval: 1000,
    pongTimeout: 1000,
  },
})
</script>

<template>
  <div>
    unplugin-todos

    {{ status }}
    {{ data }}
  </div>
</template>
