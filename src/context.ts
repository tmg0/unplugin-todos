import type MagicString from 'magic-string'
import { version } from '../package.json'
import type { Comment, TodosContext, TodosOptions } from './types'
import { resolveCommenets } from './resolve'

export function createTodos(options: TodosOptions) {
  const ctx = createInternalContext(options)

  function updateCommentsWithContext(code: string | MagicString, id: string) {
    return ctx.updateComments(code, id, ctx)
  }

  function init() {
    return ctx.runServer()
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

  async function runServer() {

  }

  return {
    version,
    options,
    runServer,
    updateComments,
    getCommentMap,
  }
}

function updateComments(code: string | MagicString, id: string, ctx: TodosContext) {
  const _map = ctx.getCommentMap()
  const _comments: Comment[] = resolveCommenets(code, id)

  return _comments
}