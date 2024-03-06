import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import MagicString from 'magic-string'
import type { TodosOptions } from './types'
import { resolveOptions } from './options'

export const defaultIncludes = [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/]
export const defaultExcludes = [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]

const toArray = <T>(x: T | T[] | undefined | null): T[] => x == null ? [] : Array.isArray(x) ? x : [x]

const unplugin = createUnplugin<Partial<TodosOptions>>((rawOptions = {}) => {
  const options = resolveOptions(rawOptions)
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
    transform(code) {
      if (!options.dev)
        return

      const s = new MagicString(code)

      if (!s.hasChanged())
        return

      return {
        code: s.toString(),
        map: s.generateMap(),
      }
    },
  }
})

export default unplugin
