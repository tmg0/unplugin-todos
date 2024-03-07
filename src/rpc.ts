import process from 'node:process'

import 'dotenv/config'

export const BASE_URL = `http://${process.env.HOST}:${process.env.NITRO_PORT}/_todos/ws`

export const rpc = {}
