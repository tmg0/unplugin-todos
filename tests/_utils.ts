import { read } from 'rc9'

export const getPortFromEnv = () => Number(read({ name: '.env', dir: '.' })?.PORT ?? 0)
