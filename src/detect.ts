import babelParser from '@babel/parser'
import type MagicString from 'magic-string'
import { hasESMSyntax } from 'mlly'
import { getMagicString } from './utils'
import type { JsAST } from './types'

export function detectJavascript(code: string | MagicString): JsAST {
  const s = getMagicString(code)
  return babelParser.parse(s.original, { sourceType: hasESMSyntax(s.original) ? 'module' : undefined })
}
