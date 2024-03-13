export default defineAppConfig({
  ui: {
    table: {
      divide: 'divide-y-0',
      thead: 'z-10',
      tbody: 'divide-y-0',
      th: {
        base: 'first:rounded-l-lg last:rounded-r-lg bg-white overflow-hidden',
      },
      td: {
        padding: 'px-4 py-3',
      },
    },
  },
})
