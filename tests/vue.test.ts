import { basename } from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveVueComments } from '../src/core/resolvers'

const caces = import.meta.glob('./caces/*.vue', { as: 'raw', eager: true })

describe('vue.js', () => {
  Object.entries(caces).forEach(([id, raw]) => {
    it(`caces ${basename(id)}`, async () => {
      const comments = resolveVueComments(raw, id)
      expect(!!comments.length).toBe(true)
    })
  })
})
