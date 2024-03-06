import babelParser from '@babel/parser'
import { DomHandler, Parser as HTMLParser } from 'htmlparser2'
import type MagicString from 'magic-string'
import { getMagicString } from './utils'
import type { Comment, H5AST, JsAST } from './types'

export function detectJavascript(code: string | MagicString): JsAST {
  const s = getMagicString(code)
  return babelParser.parse(s.original)
}

export function detectHTML(code: string): H5AST {
  const handler = new DomHandler()
  new HTMLParser(handler).end(code)
  return handler.dom
}

export function isComment(node: H5AST[number]) {
  return node.type === 'comment'
}

export function normaliseJavascriptComments(code: string | MagicString, options: { offset: number }): Comment[] {
  const comments: Comment[] = []
  const ast = detectJavascript(code)
  ast.comments?.forEach((comment) => {
    comments.push({
      file: 'js',
      type: comment.type === 'CommentBlock' ? 'block' : 'line',
      original: comment.value.trim(),
      start: (comment.start ?? 0) + options.offset,
      end: (comment.end ?? 0) + options.offset,
    })
  })
  return comments
}
