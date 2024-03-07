import type { Input } from 'valibot'
import { array, number, object, string } from 'valibot'
import { useGlobalStore } from '~/stores/global'

const schema = array(object({
  id: string(),
  type: string(),
  original: string(),
  start: number(),
  end: number(),
  line: number(),
}))

type Body = Input<typeof schema>

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  const store = useGlobalStore()
  store.syncComments(body)
  return body
})
