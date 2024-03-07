// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/_todos',
  },

  modules: ['@pinia/nuxt'],

  nitro: {
    output: {
      dir: '../../dist',
    },
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },
})
