export default defineWebSocketHandler({
  message(peer, message) {
    if (message.text().includes('ping'))
      peer.send('pong')
  },
})
