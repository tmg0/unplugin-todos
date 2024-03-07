# unplugin-todos

📋 Generate a task schedule from code comments.

## Installation

```bash
# npm
npm i -D unplugin-todos
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Todos from 'unplugin-todos'

export default defineConfig({
  plugins: [Todos.vite()],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Todos from 'unplugin-todos'

export default {
  plugins: [Todos.rollup()],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'

build({
  plugins: [require('unplugin-todos').esbuild()],
})
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [require('unplugin-todos').webpack()],
}
```

<br></details>

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
