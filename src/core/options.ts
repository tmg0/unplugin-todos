import { defu } from 'defu'
import type { TodosOptions } from './types'
import { DEFAULT_TODOS_OPTIONS } from './constants'

export function resolveOptions(options: Partial<TodosOptions>) {
  return defu(options, DEFAULT_TODOS_OPTIONS) as TodosOptions
}
