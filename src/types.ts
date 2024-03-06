import type { parse } from '@babel/parser'
import type { FilterPattern } from '@rollup/pluginutils'
import type MagicString from 'magic-string'

export interface TodosOptions {
  dev: boolean
  include: FilterPattern
  exclude: FilterPattern
}

export interface VueSFCTagContent {
  start: number
  end: number
  code: string
}

export interface VueSFC {
  s: MagicString
  id: string
  script: VueSFCTagContent
  template: VueSFCTagContent
}

export type JsAST = ReturnType<typeof parse>

export interface Comment {
  file: 'html' | 'js'
  type: 'line' | 'block'
  original: string
  start: number
  end: number
}
