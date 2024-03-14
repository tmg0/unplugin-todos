import { extname } from 'pathe'

export const isVue = (id: string) => extname(id) === '.vue'
export const isHTML = (id: string) => extname(id) === '.html'
export const isJavascript = (id: string) => ['.js', '.cjs', '.mjs', '.ts', '.mts', '.jsx', '.tsx'].includes(extname(id))

export function until(value: () => any | Promise<any>, truthyValue: any = true, ms: number = 500): Promise<void> {
  return new Promise((resolve) => {
    async function c() {
      const _v = await value()
      if (_v === truthyValue)
        resolve()
      else
        setTimeout(c, ms)
    }
    c()
  })
}
