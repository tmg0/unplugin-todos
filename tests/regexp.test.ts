/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import { parseVueSFC } from '../src/vue'
import vueScript from './fixtures/script.vue?raw'
import vueScriptSetup from './fixtures/script-setup.vue?raw'
import vueTemplate from './fixtures/template.vue?raw'

describe('regexp', () => {
  it('vue script', () => {
    const sfc = parseVueSFC(vueScript, './fixtures/script.vue')
    expect(sfc.script.code.includes('TODO')).toBe(true)
  })

  it('vue script setup', () => {
    const sfc = parseVueSFC(vueScriptSetup, './fixtures/script-setup.vue')
    expect(sfc.script.code.includes('TODO')).toBe(true)
  })

  it('vue template', () => {
    const sfc = parseVueSFC(vueTemplate, './fixtures/template.vue')
    expect(sfc.template.code.includes('TODO')).toBe(true)
  })
})
