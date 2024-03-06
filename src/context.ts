import type MagicString from 'magic-string'
import { version } from '../package.json'
import type { Comment, TodosContext, TodosOptions } from './types'
import { isHTML, isJavascript, isVue } from './utils'
import { normaliseHTMLComments, normaliseJavascriptComments } from './detect'
import { normaliseVueComments, parseVueSFC } from './vue'

export function createTodos(options: TodosOptions) {
  const ctx = createInternalContext(options)

  function collectCommentsWithContext(code: string | MagicString, id: string) {
    return ctx.collectComments(code, id, ctx)
  }

  function init() {
    return ctx.runServer()
  }

  return {
    init,
    collectComments: collectCommentsWithContext,
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
    collectComments,
    getCommentMap,
  }
}

function collectComments(code: string | MagicString, id: string, ctx: TodosContext) {
  let _comments: Comment[] = []
  const _map = ctx.getCommentMap()

  if (isJavascript(id))
    _comments = [..._comments, ...normaliseJavascriptComments(code, id)]
  if (isHTML(id))
    _comments = [..._comments, ...normaliseHTMLComments(code, id)]
  if (isVue(id)) {
    const sfc = parseVueSFC(code, id)
    _comments = [..._comments, ...normaliseVueComments(sfc)]
  }

  return _comments
}
