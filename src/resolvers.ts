import process from 'node:process'
import type MagicString from 'magic-string'
import { defu } from 'defu'
import { join } from 'pathe'
import { getMagicString, isHTML, isJavascript, isVue } from './utils'
import type { Comment, TodosContext } from './types'
import { h5CommentRE, linefeedRE } from './regexp'
import { parseVueSFC } from './vue'
import { detectJavascript } from './detect'
import { DEFAULT_RESOLVE_COMMENT_OPTIONS } from './constants'

interface ResolveCommentOptions {
  offsetChar: number
  offsetLine: number
}

function resolveOptions(rawOptions: Partial<ResolveCommentOptions> = {}) {
  return defu(rawOptions, DEFAULT_RESOLVE_COMMENT_OPTIONS) as ResolveCommentOptions
}

export function resolveJavascriptComments(code: string | MagicString, id: string, rawOptions?: Partial<ResolveCommentOptions>): Comment[] {
  const options = resolveOptions(rawOptions)
  const comments: Comment[] = []
  const ast = detectJavascript(code)

  ast.comments?.forEach((comment) => {
    comments.push({
      id,
      type: comment.type === 'CommentBlock' ? 'block' : 'inline',
      original: comment.value,
      start: (comment.start ?? 0) + options.offsetChar,
      end: (comment.end ?? 0) + options.offsetChar,
      line: (comment.loc?.start.line ?? 0) + options.offsetLine,
    })
  })
  return comments.map(normalizeComment)
}

export function resolveHTMLComments(code: string | MagicString, id: string, rawOptions?: Partial<ResolveCommentOptions>): Comment[] {
  if (!code)
    return []

  const options = resolveOptions(rawOptions)
  const comments: Comment[] = []
  const s = getMagicString(code)

  const original = s.original
  let match = h5CommentRE.exec(original)

  while (match) {
    const lf = s.original.slice(0, match.index).match(linefeedRE)?.length ?? 0

    comments.push({
      id,
      type: 'block',
      original: match[1],
      start: match.index + options.offsetChar,
      end: match.index + match[1].length + options.offsetChar,
      line: lf + 1 + options.offsetLine,
    })

    match = h5CommentRE.exec(original)
  }

  h5CommentRE.lastIndex = 0

  return comments.map(normalizeComment)
}

export function resolveVueComments(code: string | MagicString, id: string): Comment[] {
  const sfc = parseVueSFC(code, id)
  return [
    ...resolveJavascriptComments(sfc.script.code, sfc.id, { offsetChar: sfc.script.start }),
    ...resolveHTMLComments(sfc.template.code, sfc.id, { offsetChar: sfc.template.start }),
  ]
}

export function resolveCommenets(code: string | MagicString, id: string): Comment[] {
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

export function normalizeComment(comment: Comment): Comment {
  const { original } = comment
  if (comment.type === 'inline')
    return { ...comment, original: original.trim() }

  return {
    ...comment,
    original: (() => {
      const lines = original.split('\r\n').map(line => line.trim().replace(/^\s*\*+|\*+\s*$/g, '').trim())
      return lines.join('\n')
    })(),
  }
}
