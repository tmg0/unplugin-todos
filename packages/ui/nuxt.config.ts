// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  devtools: { enabled: false },

  app: {
    head: {
      title: 'unplugin-todos',
    },
  },

  nitro: {
    output: {
      dir: '../../dist',
    },

    experimental: {
      websocket: true,
    },
  },
})
