import { join } from 'node:path'
import process from 'node:process'
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

  function updateCommentsWithContext(code: string, id: string) {
    return ctx.updateComments(code, id, ctx)
  }

  async function setup() {
    await ctx.runUI()
    await ctx.createConnecton()
  }

  return {
    setup,
    updateComments: updateCommentsWithContext,
    getCommentMap: ctx.getCommentMap,
    getComments: ctx.getComments,
  }
}

export function createInternalContext(options: TodosOptions): TodosContext {
  let ws: WS | undefined
  let port: number | undefined
  let isRunning = false

  let _map: Record<string, Record<string, Comment>> = {}

  const ctx = {
    version,
    options,
    runUI,
    createConnecton,
    updateComments,
    getCommentMap,
    setCommentMap,
    getComments,
    getServerPort,
  }

  function getCommentMap() {
    return _map
  }

  function setCommentMap(data: typeof _map) {
    _map = data
  }

  function getComments() {
    const _c: Comment[] = []
    Object.values(_map).forEach((_l) => {
      _c.push(...Object.values(_l))
    })
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
    if (isRunning)
      return
    const endpoint = join(UNPLUGIN_TODOS_DIR, 'dist/server/index.mjs')
    const port = await getServerPort()
    await fse.ensureFile(UNPLUGIN_TODOS_ENV)
    write({ PORT: port }, { name: '.env', flat: true, dir: UNPLUGIN_TODOS_DIR })
    execa('node', ['-r', 'dotenv/config', endpoint], { cwd: UNPLUGIN_TODOS_DIR, stdio: 'inherit' })
    await until(() => checkPort(port), false)
    isRunning = true
  }

  async function createConnecton(baseURL?: string) {
    baseURL = baseURL ?? await getServerBaseURL(ctx)
    ws = await createWebsocket(baseURL, {
      onReceived(_, message) {
        if (message.type === 'get:comments')
          getComments()
        if (message.type === 'patch:comment')
          replaceCommentTag(message.data, ctx)
      },
    })

    return ws
  }

  return ctx
}

function updateComments(code: string, id: string, ctx: TodosContext) {
  const _map: Record<string, Record<string, Comment>> = {}

  resolveCommenets(code, id).forEach((comment) => {
    if (!_map[comment.id])
      _map[comment.id] = {}
    _map[comment.id][comment.line] = comment
  })

  ctx.setCommentMap(_map)
  return ctx.getComments()
}

async function replaceCommentTag(data: Comment, ctx: TodosContext) {
  if (!data.tag)
    return

  const _map = ctx.getCommentMap()
  if (!_map[data.id] || !_map[data.id][data.line])
    return

  const { id, tag: prevTag, start } = _map[data.id][data.line]
  const content = await fse.readFile(id, 'utf-8')
  const index = content.indexOf(prevTag, start)
  if (index > -1) {
    const prefix = content.substring(0, index)
    const suffix = content.substring(index + prevTag.length)
    await fse.writeFile(id, `${prefix}${data.tag}${suffix}`, 'utf8')
  }
}
