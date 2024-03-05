import { parse } from '@vue/compiler-sfc'
import type MagicString from 'magic-string'
import { getMagicString } from './utils'
import { getScriptAST, getTemplateAST } from './ast'
import type { VueAST, VueSFC } from './types'

export function parseVueSFC(code: string | MagicString, id: string): VueSFC {
  const s = getMagicString(code)
  const sfc = parse(s.original, { filename: id })

  const script = (() => {
    if (sfc.descriptor.scriptSetup)
      return ''
    if (sfc.descriptor.script)
      return ''

    return ''
  })()

  const ast: VueAST = {
    script: getScriptAST(script),
    template: getTemplateAST(sfc.descriptor.template?.content ?? ''),
  }

  return {
    sfc,
    ast,
  }
}
