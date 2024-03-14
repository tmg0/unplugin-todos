export default defineAppConfig({
  ui: {
    table: {
      divide: 'divide-y-0',
      thead: 'z-10',
      tbody: 'divide-y-0',
      tr: {
        base: 'even:bg-white/50 dark:even:bg-white/5',
      },
      th: {
        base: 'first:rounded-l-lg last:rounded-r-lg bg-white dark:bg-white/10 overflow-hidden',
        padding: 'px-4 py-2.5',
      },
      td: {
        base: 'first:rounded-l-lg last:rounded-r-lg overflow-hidden',
        padding: 'px-4 py-2.5',
      },
    },
  },
})
