export default defineWebSocketHandler({
  message(peer, message) {
    if (message.text() === 'ping') {
      peer.send('pong')
      return
    }

    peer.send(message.json())
  },
})
