/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import { basename } from 'pathe'
import { normaliseVueComments, parseVueSFC } from '../src/vue'

const fixtures = import.meta.glob('./fixtures/*.vue', { as: 'raw', eager: true })

describe('vue.js', () => {
  Object.entries(fixtures).forEach(([id, raw]) => {
    it(`fixture ${basename(id)}`, async () => {
      const sfc = parseVueSFC(raw, id)
      const comments = normaliseVueComments(sfc)
      expect(comments.length).toBe(1)
    })
  })
})
