/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import { checkPort } from 'get-port-please'
import { createTodos } from '../src'
import { getPortFromEnv } from './_utils'

describe('core', () => {
  const ctx = createTodos({ includes: ['./playground/tsup/src/**/*.ts'] })

  it('setup', async () => {
    await ctx.setup()
    expect(!!(await checkPort(getPortFromEnv()))).toBe(true)
  })
})
