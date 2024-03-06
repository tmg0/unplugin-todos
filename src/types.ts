import type { DomHandler } from 'htmlparser2'

export type ASTHTMLNode = DomHandler['dom'][number]

export interface Comment {
  type: 'html' | 'js'
}
