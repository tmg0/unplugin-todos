import { defu } from 'defu'
import type { TodosOptions } from './types'

export function resolveOptions(options: Partial<TodosOptions>) {
  return defu(options, { dev: true })
}
