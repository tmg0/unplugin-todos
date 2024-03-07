export default defineNuxtRouteMiddleware((to) => {
  if (to.name !== '_todos') {
    return navigateTo({ name: '_todos' })
  }
})