import MagicString from 'magic-string'
import { extname } from 'pathe'

export function getMagicString(code: string | MagicString) {
  if (typeof code === 'string')
    return new MagicString(code)

  return code
}

export const isVue = (id: string) => extname(id) === 'vue'
