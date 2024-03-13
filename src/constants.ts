import { isDevelopment } from 'std-env'

export const DEFAULT_TODOS_OPTIONS = {
  dev: isDevelopment,
  rootDir: '.',
  include: [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/],
  exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
}

export const DEFAULT_RESOLVE_COMMENT_OPTIONS = {
  offsetChar: 0,
  offsetLine: 0,
}

export const MATCH_TAGS = ['TODO', 'DONE']
