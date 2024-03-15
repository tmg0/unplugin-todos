import { isDevelopment } from 'std-env'

export const DEFAULT_TODOS_OPTIONS = {
  dev: isDevelopment,
  rootDir: '.',
  include: [],
  exclude: [],
}

export const DEFAULT_RESOLVE_COMMENT_OPTIONS = {
  offsetChar: 0,
  offsetLine: 0,
}

export const MATCH_TAGS = ['TODO', 'DONE']
