import type MagicString from 'magic-string'
import { extname } from 'pathe'
import { getMagicString } from './utils'
import { vueScriptTagRE, vueTemplateTagRE } from './regexp'

function matchTagContent(original: string, re: RegExp) {
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

export function parseVueSFC(code: string | MagicString, id: string) {
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

export function normaliseVueComments() {

}
