/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import { normaliseVueComments, parseVueSFC } from '../src/vue'
import vueScriptSetup from './fixtures/script-setup.vue?raw'

describe('vue.js', () => {
  it('parser', () => {
    const sfc = parseVueSFC(vueScriptSetup, './fixtures/script-setup.vue')
    const comments = normaliseVueComments(sfc)
    expect(comments.length).toBe(1)
  })
})
