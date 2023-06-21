import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/login/jump'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  const isReset = store.getters.isReset
  const review = store.getters.review
  if (hasToken) {
    // 有token的情况下 到登录页的路由全都重定向到首页
    if (to.path === '/login' || to.path === '/login/jump') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else if ((isReset && to.path !== '/reset') || ([3, 4].includes(review) && to.path !== '/reset')) {
      // 如果需要重置 只能填写完重置页面后 清除token 跳转到登录页 重新登录
      next({ path: '/reset' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          const { data } = await store.dispatch('user/getInfo')
          const { roles, permission, btn } = data
          const accessRoutes = await store.dispatch('permission/GenerateRoutes', { roles, permission, btn })
          // 根据roles权限生成可访问的路由表
          router.options.routes = store.getters.permission_routes
          // 没有用户数据,获取数据
          router.addRoutes(accessRoutes) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        } catch (error) {
          // 获取数据出错,抛出异常
          console.log(error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
