import { extname, isAbsolute, join } from 'node:path'
import process from 'node:process'
import { hash } from 'ohash'
import fse from 'fs-extra'

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

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function normalizeIgnores(excludes: string[] | RegExp[]) {
  return excludes.map((pattern) => {
    if (isString(pattern))
      return new RegExp(pattern)
    return pattern
  })
}

export function normalizeAbsolutePath(ids: string | string[], defaults: string | string[] = []) {
  return (() => {
    if (Array.isArray(ids) ? !!ids.length : !!ids)
      return [ids]
    return [defaults]
  })()
    .flat()
    .map(path => isAbsolute(path) ? path : join(process.cwd(), path))
}

export function generateFileHash(id: string) {
  const [path] = normalizeAbsolutePath(id, [])
  return hash(fse.readFileSync(path))
}
