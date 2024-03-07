import type MagicString from 'magic-string'
import { getMagicString } from './utils'
import { vueScriptTagRE, vueTemplateTagRE } from './regexp'
import type { VueSFC, VueSFCTagContent } from './types'

function matchTagContent(original: string, re: RegExp): VueSFCTagContent {
  let start = 0
  let end = 0
  let code = ''
  const match = re.exec(original)

  if (match) {
    code = match[1]
    start = match.index + match[0].indexOf(code)
    end = start + code.length
  }

  re.lastIndex = 0

  return {
    code,
    start,
    end,
  }
}

export function parseVueSFC(code: string | MagicString, id: string): VueSFC {
  const s = getMagicString(code)
  const original = s.original

  const script = matchTagContent(original, vueScriptTagRE)
  const template = matchTagContent(original, vueTemplateTagRE)

  return {
    s,
    id,
    script,
    template,
  }
}
