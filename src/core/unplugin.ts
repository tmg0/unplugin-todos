import { createUnplugin } from 'unplugin'
import type { TodosOptions } from './types'
import { createTodos } from './context'

export const unplugin = createUnplugin<Partial<TodosOptions> | undefined>((rawOptions = {}) => {
  createTodos(rawOptions).setup()

  return {
    name: 'todos',
  }
})

export { createTodos }
