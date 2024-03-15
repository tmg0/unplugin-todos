import process from 'node:process'
import { execa } from 'execa'
import { checkPort } from 'get-port-please'
import chokidar, { type FSWatcher } from 'chokidar'
import { read } from 'rc9'
import { generateFileHash, until } from '../src/core/utils'
import { createInternalContext } from '../src/core/context'

let watcher: FSWatcher

function sleep(ms = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function main() {
  const port = Number(read({ name: '.env', dir: '.' })?.PORT ?? 0)
  execa('pnpm', ['dev'], { stdio: 'inherit', cwd: 'packages/ui' })
  await until(() => checkPort(port), false)
  const ctx = createInternalContext({} as any)
  await sleep(5 * 1000)
  await ctx.createConnecton(`ws://localhost:${port}/api/ws`)

  watcher = chokidar.watch(['./playground/tsup/src/**/*.ts'], { persistent: true })

  watcher.on('change', (id) => {
    const hash = generateFileHash(id)
    if (hash === ctx.getFileHash(id))
      return
    ctx.updateComments(id, ctx)
    ctx.setFileHash(id, hash)
  })

  watcher.on('add', (id) => {
    ctx.updateComments(id, ctx)
  })
}

process.on('exit', () => {
  if (watcher)
    watcher.close()
})

main()
