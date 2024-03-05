import { createUnplugin } from 'unplugin'

const unplugin = createUnplugin(() => {
  return {
    name: 'todos',
    enforce: 'post',
  }
})

export default unplugin
