import { join } from 'node:path'
import process from 'node:process'
import { execa } from 'execa'
import fse from 'fs-extra'
import { checkPort, getRandomPort } from 'get-port-please'
import { read, write } from 'rc9'
import { consola } from 'consola'
import { colors } from 'consola/utils'
import chokidar from 'chokidar'
import { version } from '../../package.json'
import type { Comment, TodosContext, TodosOptions, WS } from './types'
import { resolveCommenets } from './resolvers'
import { createWebsocket, getServerBaseURL } from './ws'
import { generateFileHash, until } from './utils'
import { resolveOptions } from './options'

const UNPLUGIN_TODOS_DIR = join(process.cwd(), 'node_modules/unplugin-todos')
const UNPLUGIN_TODOS_ENV = join(UNPLUGIN_TODOS_DIR, '.env')

export function createTodos(rawOptions: Partial<TodosOptions> = {}) {
  const options = resolveOptions(rawOptions)
  const ctx = createInternalContext(options)

  function updateCommentsWithContext(id: string) {
    const code = fse.readFileSync(id, 'utf-8')
    return ctx.updateComments(code, id, ctx)
  }

  async function setupWatcher() {
    const watcher = chokidar.watch(options.includes, { persistent: true })

    watcher.on('change', (id) => {
      const hash = generateFileHash(id)
      if (hash === ctx.getFileHash(id))
        return
      updateCommentsWithContext(id)
      ctx.setFileHash(id, hash)
    })

    watcher.on('add', (id) => {
      updateCommentsWithContext(id)
    })
  }

  async function setup() {
    if (!options.dev)
      return
    await ctx.runUI()
    await ctx.createConnecton()
    await setupWatcher()
  }

  return {
    setup,
    updateComments: updateCommentsWithContext,
    getCommentMap: ctx.getCommentMap,
    getComments: ctx.getComments,
    getFileHash: ctx.getFileHash,
    setFileHash: ctx.setFileHash,
  }
}

export function createInternalContext(options: TodosOptions): TodosContext {
  let ws: WS | undefined
  let port: number | undefined
  let isRunning = false
  const fileHashRecord: Record<string, string> = {}

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
    getFileHash,
    setFileHash,
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

  function getFileHash(id: string) {
    return fileHashRecord[id]
  }

  function setFileHash(id: string, hash: string) {
    fileHashRecord[id] = hash
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

    const port = await getServerPort()

    const root = options._debug ? '.' : UNPLUGIN_TODOS_DIR
    const endpoint = join(root, 'dist/server/index.mjs')
    await fse.ensureFile(UNPLUGIN_TODOS_ENV)
    write({ PORT: port }, { name: '.env', flat: true, dir: root })
    execa('node', ['-r', 'dotenv/config', endpoint], { cwd: root })
    await until(() => checkPort(port), false)
    const prefix = `${colors.magenta('unplugin-todos')} ${colors.gray(`v${ctx.version}`)}`
    const host = colors.blue(`http://localhost:${port}/`)
    consola.box(`${prefix}\n\nRunning on: ${host}`)
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
  const _map = ctx.getCommentMap()
  _map[id] = {}
  resolveCommenets(code, id).forEach((comment) => {
    _map[id][comment.line] = comment
  })
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
