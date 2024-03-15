import babelParser from '@babel/parser'
import { hasESMSyntax } from 'mlly'
import type { JsAST } from './types'

export function detectJavascript(code: string): JsAST {
  return babelParser.parse(code, { sourceType: hasESMSyntax(code) ? 'module' : undefined })
}
