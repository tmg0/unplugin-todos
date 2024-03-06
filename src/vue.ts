import type MagicString from 'magic-string'
import { extname } from 'pathe'
import { getMagicString } from './utils'
import { vueScriptTagRE, vueTemplateTagRE } from './regexp'
import { normaliseJavascriptComments } from './ast'
import type { Comment, VueSFC, VueSFCTagContent } from './types'

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

export const isVue = (id: string) => extname(id) === 'vue'

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

export function normaliseVueComments(sfc: VueSFC): Comment[] {
  return [
    ...normaliseJavascriptComments(sfc.script.code, { offset: sfc.script.start }),
  ]
}
