import { join } from 'node:path'
import process from 'node:process'
import type MagicString from 'magic-string'
import { execa } from 'execa'
import fse from 'fs-extra'
import { checkPort, getRandomPort } from 'get-port-please'
import { read, write } from 'rc9'
import { version } from '../package.json'
import type { Comment, TodosContext, TodosOptions, WS } from './types'
import { resolveCommenets } from './resolvers'
import { createWebsocket, getServerBaseURL } from './ws'
import { until } from './utils'

const UNPLUGIN_TODOS_DIR = join(process.cwd(), 'node_modules/unplugin-todos')
const UNPLUGIN_TODOS_ENV = join(UNPLUGIN_TODOS_DIR, '.env')

export function createTodos(options: TodosOptions) {
  const ctx = createInternalContext(options)

  function updateCommentsWithContext(code: string | MagicString, id: string) {
    return ctx.updateComments(code, id, ctx)
  }

  async function init() {
    await ctx.runUI()
    await ctx.createConnecton()
  }

  return {
    init,
    updateComments: updateCommentsWithContext,
    getCommentMap: ctx.getCommentMap,
    getComments: ctx.getComments,
  }
}

export function createInternalContext(options: TodosOptions): TodosContext {
  let ws: WS | undefined
  let port: number | undefined
  const _map: Record<string, Comment> = {}

  const ctx = {
    version,
    options,
    runUI,
    createConnecton,
    updateComments,
    getCommentMap,
    getComments,
    getServerPort,
  }

  function getCommentMap() {
    return _map
  }

  function getComments() {
    const _c = Object.values(_map)
    ws?.put('comments', _c)
    return _c
  }

  async function getServerPort() {
    if (port)
      return port

    port = read({ name: '.env', dir: UNPLUGIN_TODOS_DIR })?.PORT
    port = port ? Number(port) : undefined
    if (!port)
      port = await getRandomPort()
    else if (await checkPort(port))
      return port
    else
      port = await getRandomPort()

    return port
  }

  async function runUI(): Promise<void> {
    const endpoint = join(UNPLUGIN_TODOS_DIR, 'dist/server/index.mjs')
    const port = await getServerPort()
    await fse.ensureFile(UNPLUGIN_TODOS_ENV)
    write({ PORT: port }, { name: '.env', flat: true, dir: UNPLUGIN_TODOS_DIR })
    execa('node', ['-r', 'dotenv/config', endpoint], { cwd: UNPLUGIN_TODOS_DIR, stdio: 'inherit' })
    await until(() => checkPort(port), false)
  }

  async function createConnecton() {
    const baseURL = await getServerBaseURL(ctx)
    ws = await createWebsocket(baseURL, {
      onReceived(_, message) {
        if (message.type === 'get:comments')
          getComments()
      },
    })

    return ws
  }

  return ctx
}

function updateComments(code: string | MagicString, id: string, ctx: TodosContext) {
  const _map = ctx.getCommentMap()

  resolveCommenets(code, id).forEach((comment) => {
    const _key = `${comment.id}|${comment.line}`
    _map[_key] = comment
  })

  return ctx.getComments()
}
