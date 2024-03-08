/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import { createInternalContext } from '../src/context'
import vueScriptSetup from './fixtures/script-setup.vue?raw'

describe('context', () => {
  it('init', async () => {
    const ctx = createInternalContext({} as any)
    await ctx.createConnecton()
    ctx.updateComments(vueScriptSetup, './fixtures/script-setup.vue', ctx)
    expect(ctx.getComments().length).toBe(4)
  })
})
