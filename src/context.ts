import type MagicString from 'magic-string'
import { execa } from 'execa'
import { version } from '../package.json'
import type { Comment, TodosContext, TodosOptions, WS } from './types'
import { resolveCommenets } from './resolvers'
import { BASE_URL, createWebsocket } from './ws'

export function createTodos(options: TodosOptions) {
  const ctx = createInternalContext(options)

  function updateCommentsWithContext(code: string | MagicString, id: string) {
    return ctx.updateComments(code, id, ctx)
  }

  async function init() {
    await ctx.runUI()
    await ctx.createConnecton()
  }

  return {
    init,
    updateComments: updateCommentsWithContext,
    getCommentMap: ctx.getCommentMap,
    getComments: ctx.getComments,
  }
}

export function createInternalContext(options: TodosOptions): TodosContext {
  let ws: WS | undefined
  const _map: Record<string, Comment> = {}

  function getCommentMap() {
    return _map
  }

  function getComments() {
    const _c = Object.values(_map)
    ws?.put('comments', _c)
    return _c
  }

  async function runUI() {
    const endpoint = 'node_modules/unplugin-todos/dist/server/index.mjs'
    await execa('node', ['-r', 'dotenv/config', endpoint], { stdio: 'inherit' })
  }

  async function createConnecton() {
    ws = await createWebsocket(BASE_URL, {
      onConnected({ put }) {
        put('comments', getComments())
      },

      onReceived({ put }, message) {
        if (message.type === 'get:comments')
          put('comments', getComments())
      },
    })

    return ws
  }

  return {
    version,
    options,
    runUI,
    createConnecton,
    updateComments,
    getCommentMap,
    getComments,
  }
}

function updateComments(code: string | MagicString, id: string, ctx: TodosContext) {
  const _map = ctx.getCommentMap()

  resolveCommenets(code, id).forEach((comment) => {
    const _key = `${comment.id}|${comment.line}`
    _map[_key] = comment
  })

  return ctx.getComments()
}
