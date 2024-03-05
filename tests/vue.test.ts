/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import { parseVueSFC } from '../src/vue'
import vueScript from './fixtures/script.vue?raw'
import vueScriptSetup from './fixtures/script-setup.vue?raw'
import vueTemplate from './fixtures/template.vue?raw'

describe('vue.js', () => {
  it('script', () => {

  })

  it('script setup', () => {

  })

  it('template', () => {
    expect(!!parseVueSFC(vueTemplate, './fixtures/template.vue')).toBe(true)
  })
})
