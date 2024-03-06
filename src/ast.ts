import babelParser from '@babel/parser'
import { DomHandler, Parser as HTMLParser } from 'htmlparser2'
import type MagicString from 'magic-string'
import { getMagicString } from './utils'
import type { ASTHTMLNode } from './types'

export function detectJavascript(code: string | MagicString) {
  const s = getMagicString(code)
  return babelParser.parse(s.original)
}

export function detectHTML(code: string): DomHandler['dom'] {
  const handler = new DomHandler()
  new HTMLParser(handler).end(code)
  return handler.dom
}

export function isComment(node: ASTHTMLNode) {
  return node.type === 'comment'
}
