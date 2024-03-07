import type { Input } from 'valibot'
import { array, number, object, parse, string } from 'valibot'

const Schema = array(object({
  id: string(),
  type: string(),
  original: string(),
  start: number(),
  end: number(),
  line: number(),
}))

type Body = Input<typeof Schema>

export default defineEventHandler(async (event) => {
  const rawBody = await readBody<Body>(event)
  const body = parse(Schema, rawBody)
  return body
})
