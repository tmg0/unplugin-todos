import { createTodos } from '../src'

const ctx = createTodos({
  _debug: true,
  dev: true,
  includes: ['./playground/tsup/src/**/*.ts'],
})

ctx.setup()
