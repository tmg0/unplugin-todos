import { defineConfig } from 'tsup'
import Todos from '../../src/index'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  esbuildPlugins: [
    Todos.esbuild({}),
  ],
})
