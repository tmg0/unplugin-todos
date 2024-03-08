import MagicString from 'magic-string'
import { extname } from 'pathe'

export function getMagicString(code: string | MagicString) {
  if (typeof code === 'string')
    return new MagicString(code)

  return code
}

export const isVue = (id: string) => extname(id) === '.vue'
export const isHTML = (id: string) => extname(id) === '.html'
export const isJavascript = (id: string) => ['.js', '.cjs', '.mjs', '.ts', '.mts', '.jsx', '.tsx'].includes(extname(id))
