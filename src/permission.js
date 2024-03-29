import router, { resetRouter } from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { getFirstPath } from '@/utils/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult', 'exception404', 'patientDashboard'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/'
let isLoading = false
router.beforeEach((to, from, next) => {
  // 防止加载动态路由时重复触发
  if (isLoading) {
    return
  }
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  /* has token */
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // check login user.roles is null
      if (store.getters.roles.length === 0) {
        // request login userInfo
        store
          .dispatch('GetInfo')
          .then(res => {
            const role = res && res.role
            // generate dynamic router
            store.dispatch('GenerateRoutes', { role }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              resetRouter()
              isLoading = true
              store.getters.addRouters.forEach(r => {
                router.addRoute(r)
              })
              isLoading = false
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              let redirect = from.query.redirect ? decodeURIComponent(from.query.redirect) : null
              const firstMenu = store.getters.firstMenu
              console.log('firstMenu', firstMenu)
              // 访问首页时跳转第一个路由菜单地址
              if (to.path === defaultRoutePath && !redirect) {
                redirect = getFirstPath(firstMenu)
              } else if (!redirect) {
                redirect = to.path
              }
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else if (!router.hasDynamicRoute) {
    // 初始化先加载无需权限的页面路由
    store.dispatch('GenerateRoutes').then(() => {
      isLoading = true
      store.getters.addRouters.forEach(r => {
        router.addRoute(r)
      })
      isLoading = false
      router.hasDynamicRoute = true
      // 重新进入beforeEach
      next({
        ...to,
        replace: true
      })
    })
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
