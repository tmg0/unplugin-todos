import type { parse } from '@babel/parser'
import type WebSocket from 'ws'

export interface TodosOptions {
  dev: boolean
  rootDir: string
  includes: string[]
  excludes: string[]

  _debug: boolean
}

export interface VueSFCTagContent {
  start: number
  end: number
  code: string
}

export interface VueSFC {
  s: string
  id: string
  script: VueSFCTagContent
  template: VueSFCTagContent
}

export type JsAST = ReturnType<typeof parse>

export interface Comment {
  id: string
  type: 'inline' | 'block'
  original: string
  tag: string
  content: string
  start: number
  end: number
  line: number
}

export interface Message {
  type: string
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
  createConnecton: (baseURL?: string) => Promise<WS>
  updateComments: (code: string, id: string, ctx: TodosContext) => void
  getCommentMap: () => Record<string, Record<string, Comment>>
  setCommentMap: (data: Record<string, Record<string, Comment>>) => void
  getComments: () => Comment[]
  getServerPort: () => Promise<number>
  getFileHash: (id: string) => string
  setFileHash: (id: string, hash: string) => void
}
