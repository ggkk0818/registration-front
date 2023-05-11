import Stomp from 'stompjs'
// import SockJS from 'sockjs-client'
import EventEmitter from 'eventemitter3'
export const STOMP_EVENT = {
  APPOINTMENT: 'appointment',
  RESOURCE: 'resource',
  ANNOUNCEMENT: 'announcement'
}
class SocketService extends EventEmitter {
  constructor () {
    super()
    this.socket = null
    this.stompClient = null
    this.subscribeList = []
  }
  get isConnected () {
    // return this.socket?.readyState === SockJS.OPEN
    return this.stompClient?.connected
  }
  get isClosed () {
    // const readyState = this.socket?.readyState
    // return readyState !== SockJS.CONNECTING && readyState !== SockJS.OPEN
    return !this.stompClient?.connected
  }
  init () {
    // this.socket = new SockJS(process.env.VUE_APP_WEBSOCKET_URL)
    this.stompClient = Stomp.client(process.env.VUE_APP_WEBSOCKET_URL)
  }
  async connect () {
    if (this.isConnected) {
      return
    }
    console.log('连接stomp服务器...')
    this.init()
    await new Promise((resolve, reject) => {
      this.stompClient.connect({
        login: process.env.VUE_APP_WEBSOCKET_USER,
        passcode: process.env.VUE_APP_WEBSOCKET_PASS
      }, resolve, reject)
    })
  }
  disconnect () {
    return new Promise((resolve, reject) => {
      try {
        this.stompClient.disconnect(resolve)
        this.subscribeList = []
      } catch (err) {
        reject(err)
      }
    })
  }
  /**
   * 订阅预约、号源、公告消息
   */
  subscribe () {
    const subAppointment = this.stompClient.subscribe('/topic/appointment', res => {
      try {
        this.emit(STOMP_EVENT.APPOINTMENT, JSON.parse(res.body))
      } catch (err) {}
    })
    const subResource = this.stompClient.subscribe('/topic/resource', res => {
      try {
        this.emit(STOMP_EVENT.RESOURCE, JSON.parse(res.body))
      } catch (err) {}
    })
    const subAnnouncement = this.stompClient.subscribe('/topic/announcement', res => {
      try {
        this.emit(STOMP_EVENT.ANNOUNCEMENT, JSON.parse(res.body))
      } catch (err) {}
    })
    this.subscribeList.push(subAppointment, subResource, subAnnouncement)
  }
  /**
   * 取消订阅
   */
  unsubscribe () {
    while (this.subscribeList && this.subscribeList.length > 0) {
      this.subscribeList.shift().unsubscribe()
    }
  }
}
// 单例模式
const instance = new SocketService()
export default instance
