import { createUnplugin } from 'unplugin'
import type { TodosOptions } from './types'
import { resolveOptions } from './options'
import { createTodos } from './context'

const unplugin = createUnplugin<Partial<TodosOptions> | undefined>((rawOptions = {}) => {
  const options = resolveOptions(rawOptions)
  const ctx = createTodos(options)

  if (options.dev)
    ctx.setup()

  return {
    name: 'todos',
  }
})

export default unplugin
