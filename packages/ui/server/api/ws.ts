export default defineWebSocketHandler({
  open(peer) {
    peer.send({ type: 'connected' })
  },
  
  message(peer, message) {
    if (message.text() === 'ping') {
      peer.send('pong')
      return
    }

    peer.send(message)
  },
})
