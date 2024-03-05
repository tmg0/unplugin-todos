/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import { parseVueSFC } from '../src/vue'

const fixtures = import.meta.glob('./fixtures/**/*.{vue,js,ts}', {
  eager: true,
  as: 'raw',
})

describe('vue 3.x', () => {
  Object.entries(fixtures).forEach(([id, code]) => {
    it(`fixture ${id}`, () => {
      expect(!!parseVueSFC(code, id)).toBe(true)
    })
  })
})
