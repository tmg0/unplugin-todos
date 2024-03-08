import type { parse } from '@babel/parser'
import type { FilterPattern } from '@rollup/pluginutils'
import type MagicString from 'magic-string'
import type WebSocket from 'ws'

export interface TodosOptions {
  dev: boolean
  rootDir: string
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
  id: string
  type: 'line' | 'block'
  original: string
  start: number
  end: number
  line: number
}

export interface Message {
  type: 'ping' | 'pong' | 'connected' | 'put:comments' | 'get:comments'
  data?: any
}

export interface WS {
  ws: WebSocket | undefined
  connect: () => Promise<void>
  close: () => void
  ping: () => void
  put: (domain: 'comments', data: any) => void
  onReceived: (cb: (message: Message) => void) => void
}

export interface TodosContext {
  version: string
  options: TodosOptions

  runUI: () => Promise<void>
  createConnecton: () => Promise<WS>
  updateComments: (code: string | MagicString, id: string, ctx: TodosContext) => void
  getCommentMap: () => Record<string, Comment>
  getComments: () => Comment[]
}
