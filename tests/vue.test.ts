/// <reference types="vite/client" />

import { basename } from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveVueComments } from '../src/resolvers'

const fixtures = import.meta.glob('./fixtures/*.vue', { as: 'raw', eager: true })

describe('vue.js', () => {
  Object.entries(fixtures).forEach(([id, raw]) => {
    it(`fixture ${basename(id)}`, async () => {
      const comments = resolveVueComments(raw, id)
      expect(!!comments.length).toBe(true)
    })
  })
})
