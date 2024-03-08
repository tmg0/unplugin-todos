import type MagicString from 'magic-string'
import { execa } from 'execa'
import { version } from '../package.json'
import type { Comment, TodosContext, TodosOptions } from './types'
import { resolveCommenets } from './resolvers'
import { BASE_URL, createWebsocket } from './ws'

export function createTodos(options: TodosOptions) {
  const ctx = createInternalContext(options)

  function updateCommentsWithContext(code: string | MagicString, id: string) {
    return ctx.updateComments(code, id, ctx)
  }

  async function init() {
    await ctx.runUI()
    await ctx.ws
  }

  return {
    init,
    updateComments: updateCommentsWithContext,
    getCommentMap: ctx.getCommentMap,
    getComments: ctx.getComments,
  }
}

export function createInternalContext(options: TodosOptions): TodosContext {
  const _map: Record<string, Comment> = {}

  function getCommentMap() {
    return _map
  }

  function getComments() {
    return Object.values(_map)
  }

  async function runUI() {
    // const endpoint = 'node_modules/unplugin-todos/dist/server/index.mjs'
    // await execa('node', ['-r', 'dotenv/config', endpoint], { stdio: 'inherit' })
  }

  const ws = createWebsocket(BASE_URL, {
    onReceived({ put }, message) {
      if (message.type === 'get:comments')
        put('comments', getComments())
    },
  })

  return {
    version,
    options,
    ws,
    runUI,
    updateComments,
    getCommentMap,
    getComments,
  }
}

function updateComments(code: string | MagicString, id: string, ctx: TodosContext) {
  const _map = ctx.getCommentMap()
  const _comments: Comment[] = resolveCommenets(code, id)

  _comments.forEach((comment) => {
    const _key = `${comment.id}|${comment.line}`
    _map[_key] = comment
  })

  return _comments
}
