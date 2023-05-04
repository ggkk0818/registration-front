import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

/**
 * 创建路由实例
 * @returns
 */
const createRouter = () => {
  return new Router({
    mode: 'history',
    routes: constantRouterMap,
    hasDynamicRoute: false // 是否已加载动态路由
  })
}

Vue.use(Router)
const router = createRouter()

/**
 * 重置路由表
 */
export function resetRouter () {
  router.matcher = createRouter().matcher
}

export default router
