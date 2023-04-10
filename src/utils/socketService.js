import Stomp from 'stompjs'
import SockJS from 'sockjs-client'

class SocketService {
  constructor () {
    this.socket = null
    this.stompClient = null
  }
  init () {
    this.socket = new SockJS(this.socketUrl)
    this.stompClient = Stomp.over(this.socket)
  }
  connect () {
    return new Promise((resolve, reject) => {
      this.stompClient.connect({}, resolve, reject)
    })
  }
  subscribe (topic) {
    this.stompClient.subscribe(topic, res => {
      this.emit('message', res)
    })
  }
}

export default new SocketService()
