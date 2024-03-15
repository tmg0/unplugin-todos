import { createUnplugin } from 'unplugin'
import type { TodosOptions } from './types'
import { resolveOptions } from './options'
import { createTodos } from './context'

export const unplugin = createUnplugin<Partial<TodosOptions> | undefined>((rawOptions = {}) => {
  const options = resolveOptions(rawOptions)
  const ctx = createTodos(options)

  if (options.dev)
    ctx.setup()

  return {
    name: 'todos',
  }
})
