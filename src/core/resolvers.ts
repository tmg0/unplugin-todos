import process from 'node:process'
import { join } from 'node:path'
import { defu } from 'defu'
import { isHTML, isJavascript, isVue } from './utils'
import type { Comment, TodosContext } from './types'
import { h5CommentRE, jsCommentRE, linefeedRE } from './regexp'
import { parseVueSFC } from './vue'
import { DEFAULT_RESOLVE_COMMENT_OPTIONS, MATCH_TAGS } from './constants'

interface ResolveCommentOptions {
  offsetChar: number
  offsetLine: number
}

function resolveOptions(rawOptions: Partial<ResolveCommentOptions> = {}) {
  return defu(rawOptions, DEFAULT_RESOLVE_COMMENT_OPTIONS) as ResolveCommentOptions
}

export function resolveJavascriptComments(code: string, id: string, rawOptions?: Partial<ResolveCommentOptions>): Comment[] {
  if (!code)
    return []

  const options = resolveOptions(rawOptions)
  const comments: Comment[] = []

  let match = jsCommentRE.exec(code)

  while (match) {
    const lf = code.slice(0, match.index).match(linefeedRE)?.length ?? 0

    const type = match[1] ? 'inline' : 'block'
    const original = type === 'inline' ? match[1] : match[2]

    const _c = normalizeComment({
      id,
      type,
      original,
      start: match.index + options.offsetChar,
      end: match.index + original.length + options.offsetChar,
      line: lf + 1 + options.offsetLine,
    })

    if (_c)
      comments.push(_c)

    match = jsCommentRE.exec(code)
  }

  jsCommentRE.lastIndex = 0

  return comments
}

export function resolveHTMLComments(code: string, id: string, rawOptions?: Partial<ResolveCommentOptions>): Comment[] {
  if (!code)
    return []

  const options = resolveOptions(rawOptions)
  const comments: Comment[] = []

  let match = h5CommentRE.exec(code)

  while (match) {
    const lf = code.slice(0, match.index).match(linefeedRE)?.length ?? 0

    const _c = normalizeComment({
      id,
      type: 'block',
      original: match[1],
      start: match.index + options.offsetChar,
      end: match.index + match[1].length + options.offsetChar,
      line: lf + 1 + options.offsetLine,
    })

    if (_c)
      comments.push(_c)

    match = h5CommentRE.exec(code)
  }

  h5CommentRE.lastIndex = 0

  return comments
}

export function resolveVueComments(code: string, id: string): Comment[] {
  const sfc = parseVueSFC(code, id)
  return [
    ...resolveJavascriptComments(sfc.script.code, sfc.id, { offsetChar: sfc.script.start }),
    ...resolveHTMLComments(sfc.template.code, sfc.id, { offsetChar: sfc.template.start }),
  ]
}

export function resolveCommenets(code: string, id: string): Comment[] {
  if (isJavascript(id))
    return resolveJavascriptComments(code, id)
  if (isHTML(id))
    return resolveHTMLComments(code, id)
  if (isVue(id))
    return resolveVueComments(code, id)

  return []
}

export function resolveVscodeURL(comment: Comment, ctx: TodosContext) {
  const filepath = join(process.cwd(), ctx.options.rootDir, comment.id)

  return {
    url: `vscode://file/${filepath}:${comment.line}`,
  }
}

export function normalizeComment(comment: Omit<Comment, 'tag' | 'content'>): Comment | undefined {
  const { original } = comment

  const _o = (() => {
    if (comment.type === 'inline')
      return original?.trim() ?? ''
    const lines = original.split('\n').map(line => line.trim().replace(/^\s*\*+|\*+\s*$/g, '').trim())
    return lines.filter(Boolean).join('\n')
  })()

  const [tag, ...content] = _o.split(':')

  if (!MATCH_TAGS.some(tag => _o.startsWith(tag)))
    return

  return {
    ...comment,
    tag,
    content: content.join(''),
    original: _o,
  }
}
