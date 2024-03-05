import { createUnplugin } from 'unplugin'
import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'

export interface UnpluginTodosOptions {
  include: FilterPattern
  exclude: FilterPattern
}

export const defaultIncludes = [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/]
export const defaultExcludes = [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]

const toArray = <T>(x: T | T[] | undefined | null): T[] => x == null ? [] : Array.isArray(x) ? x : [x]

const unplugin = createUnplugin<Partial<UnpluginTodosOptions>>((options = {}) => {
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
  }
})

export default unplugin
