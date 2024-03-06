import type { DomHandler } from 'htmlparser2'
import type { parse } from '@babel/parser'
import type MagicString from 'magic-string'

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

export type H5AST = DomHandler['dom']

export type JsAST = ReturnType<typeof parse>

export interface Comment {
  file: 'html' | 'js'
  type: 'line' | 'block'
  original: string
  start: number
  end: number
}
