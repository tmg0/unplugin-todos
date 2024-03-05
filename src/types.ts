import type { SFCParseResult } from '@vue/compiler-sfc'
import type { DomHandler } from 'htmlparser2'
import type { ParseResult } from '@babel/parser'

export interface AST {
  script?: ParseResult<any>
  template?: DomHandler['dom']
}

export type VueAST = Required<AST>

export interface VueSFC {
  sfc: SFCParseResult
  ast: VueAST
}

export type ASTHTMLNode = DomHandler['dom'][number]
