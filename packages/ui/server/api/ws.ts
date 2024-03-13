import { destr } from 'destr'

interface Message {
  type: 'ping' | 'pong' | 'connected' | 'put:comments' | 'get:comments' | 'patch:comment:id'
  data?: any
}

const isPing = ({ type }: Message) => type === 'ping'

const decodeMessage = (message: string) => destr<Message>(message)

const defineResponse = (type: Message['type'], data?: any): Message => ({ type, data })

export default defineWebSocketHandler({
  open(peer) {
    peer.subscribe('channel')
    peer.send(defineResponse('connected'))
  },

  message(peer, message) {
    const response = decodeMessage(message.text())
    if (isPing(response)) {
      peer.send(defineResponse('pong'))
      return
    }

    const [method, domain, id] = response.type.split(':')

    if (method === 'put')
      peer.publish('channel', defineResponse(`put:${domain}` as Message['type'], response.data))

    if (method === 'get')
      peer.publish('channel', defineResponse(`get:${domain}` as Message['type']))

    if (method === 'patch')
      peer.publish('channel', defineResponse(`patch:${domain}:${id}` as Message['type'], response.data))
  },
})
