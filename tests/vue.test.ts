/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import { basename } from 'pathe'
import { resolveVueComments } from '../src/resolve'

const fixtures = import.meta.glob('./fixtures/*.vue', { as: 'raw', eager: true })

describe('vue.js', () => {
  Object.entries(fixtures).forEach(([id, raw]) => {
    it(`fixture ${basename(id)}`, async () => {
      const comments = resolveVueComments(raw, id)
      expect(!!comments.length).toBe(true)
    })
  })
})
