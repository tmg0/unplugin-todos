import process from 'node:process'
import { ofetch } from 'ofetch'

import 'dotenv/config'

const BASE_URL = `http://${process.env.HOST}:${process.env.NITRO_PORT}`

function createComments(body: any) {
  return ofetch('/api/comments', {
    baseURL: BASE_URL,
    method: 'POST',
    body,
  })
}

export const rpc = {
  createComments,
}
