import type MagicString from 'magic-string'
import { execa } from 'execa'
import { version } from '../package.json'
import type { Comment, TodosContext, TodosOptions } from './types'
import { resolveCommenets } from './resolvers'
import { setupWS } from './ws'
import { rpc } from './rpc'

export function createTodos(options: TodosOptions) {
  const ctx = createInternalContext(options)

  function updateCommentsWithContext(code: string | MagicString, id: string) {
    return ctx.updateComments(code, id, ctx)
  }

  async function init() {
    await ctx.runUI()
  }

  return {
    init,
    updateComments: updateCommentsWithContext,
    getCommentMap: ctx.getCommentMap,
  }
}

export function createInternalContext(options: TodosOptions): TodosContext {
  const _map: Record<string, Comment> = {}

  function getCommentMap() {
    return _map
  }

  async function runUI() {
    const endpoint = 'node_modules/unplugin-todos/dist/server/index.mjs'
    await execa('node', ['-r', 'dotenv/config', endpoint], { stdio: 'inherit' })
    await setupWS()
  }

  return {
    version,
    options,
    runUI,
    updateComments,
    getCommentMap,
  }
}

function updateComments(code: string | MagicString, id: string, ctx: TodosContext) {
  const _map = ctx.getCommentMap()
  const _comments: Comment[] = resolveCommenets(code, id)

  rpc.syncComments()

  return _comments
}
