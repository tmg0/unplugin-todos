// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/_todos',
  },

  nitro: {
    output: {
      dir: '../../dist',
    },
  },
})
