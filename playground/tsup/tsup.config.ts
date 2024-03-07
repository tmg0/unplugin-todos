import { defineConfig } from 'tsup'
import Todos from 'unplugin-todos'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  esbuildPlugins: [
    Todos.esbuild({}),
  ],
})
