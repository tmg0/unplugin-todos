import { destr } from 'destr'

interface Message {
  type: 'ping' | 'pong' | 'connected'
  data?: any
}

const isPing = ({ type }: Message) => type === 'ping'

const decodeMessage = (message: string) => destr<Message>(message)

const defineResponse = (type: Message['type'], data?: any): Message => ({ type, data })

export default defineWebSocketHandler({
  open(peer) {
    peer.send(defineResponse('connected'))
  },

  message(peer, message) {
    const data = decodeMessage(message.text())
    if (isPing(data)) {
      peer.send(defineResponse('pong'))
      return
    }

    peer.send(message.text())
  },
})
