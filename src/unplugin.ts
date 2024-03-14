import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import type { TodosOptions } from './types'
import { resolveOptions } from './options'
import { createTodos } from './context'

export const defaultIncludes = [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/]
export const defaultExcludes = [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]

const toArray = <T>(x: T | T[] | undefined | null): T[] => x == null ? [] : Array.isArray(x) ? x : [x]

const unplugin = createUnplugin<Partial<TodosOptions> | undefined>((rawOptions = {}) => {
  const options = resolveOptions(rawOptions)
  const ctx = createTodos(options)

  const filter = createFilter(
    toArray(options.include as string[] || []).length
      ? options.include
      : defaultIncludes,
    options.exclude || defaultExcludes,
  )

  return {
    name: 'todos',
    enforce: 'post',
    transformInclude(id) {
      return filter(id)
    },
    transform(code, id) {
      if (!options.dev)
        return

      ctx.updateComments(code, id)

      return undefined
    },
    async buildStart() {
      if (options.dev)
        await ctx.setup()
    },
  }
})

export default unplugin
