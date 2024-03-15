/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import { parseVueSFC } from '../src/core/vue'
import vueScript from './caces/script.vue?raw'
import vueScriptSetup from './caces/script-setup.vue?raw'
import vueTemplate from './caces/template.vue?raw'

describe('regexp', () => {
  it('vue script', () => {
    const sfc = parseVueSFC(vueScript, './caces/script.vue')
    expect(sfc.script.code.includes('TODO')).toBe(true)
  })

  it('vue script setup', () => {
    const sfc = parseVueSFC(vueScriptSetup, './caces/script-setup.vue')
    expect(sfc.script.code.includes('TODO')).toBe(true)
  })

  it('vue template', () => {
    const sfc = parseVueSFC(vueTemplate, './caces/template.vue')
    expect(sfc.template.code.includes('TODO')).toBe(true)
  })
})
