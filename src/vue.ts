import { parse } from '@vue/compiler-sfc'
import type MagicString from 'magic-string'
import { getMagicString } from './utils'

export function parseVueSFC(code: string | MagicString, id: string) {
  const s = getMagicString(code)
  const sfc = parse(s.original, { filename: id })

  return {
    sfc,
  }
}
