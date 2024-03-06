import babelParser from '@babel/parser'
import type MagicString from 'magic-string'
import { hasESMSyntax } from 'mlly'
import { getMagicString } from './utils'
import type { Comment, JsAST } from './types'
import { h5CommentRE } from './regexp'

export function detectJavascript(code: string | MagicString): JsAST {
  const s = getMagicString(code)
  return babelParser.parse(s.original, { sourceType: hasESMSyntax(s.original) ? 'module' : undefined })
}

export function normaliseJavascriptComments(code: string | MagicString, id: string, options: { offset: number } = { offset: 0 }): Comment[] {
  const comments: Comment[] = []
  const ast = detectJavascript(code)

  ast.comments?.forEach((comment) => {
    comments.push({
      id,
      type: comment.type === 'CommentBlock' ? 'block' : 'line',
      original: comment.value.trim(),
      start: (comment.start ?? 0) + options.offset,
      end: (comment.end ?? 0) + options.offset,
    })
  })
  return comments
}

export function normaliseHTMLComments(code: string | MagicString, id: string, options: { offset: number } = { offset: 0 }): Comment[] {
  const comments: Comment[] = []
  const s = getMagicString(code)

  const original = s.original
  let match = h5CommentRE.exec(original)

  while (match) {
    comments.push({
      id,
      type: 'block',
      original: match[1].trim(),
      start: match.index + options.offset,
      end: match.index + match[1].length + options.offset,
    })

    match = h5CommentRE.exec(original)
  }

  h5CommentRE.lastIndex = 0

  return comments
}
