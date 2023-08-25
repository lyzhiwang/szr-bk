import {
  constantRoutes,
  elseRouter
} from '@/router'
import {
  formatPermiBtn
} from '@/utils/authority'

const Layout = () => import('@/layout/index')

/**
   * 通过meta.role判断是否与当前用户权限匹配
   * @param roles
   * @param route
   */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles && route.meta.roles.length) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
   * 递归过滤异步路由表，返回符合用户角色权限的路由表
   * @param routes asyncRouterMap
   * @param roles
   */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
   * 递归处理component，将component重新挂载，返回符合完整的路由表
   * @param routes asyncRouterMap
   * @param roles
   */
function toRouter(permission, permissionBtn, parentPath) {
  var btnKey = ['roles', 'btnType', 'path', 'method', 'api']
  if (!permissionBtn) permissionBtn = {}
  for (let i = 0; i < permission.length; i++) {
    // type 1分组 2按钮 3页面
    // 若有按钮权限则处理 若无则不处理 此处为兼容rap2
    if (permission[i].meta.type === 2) {
      // 获取按钮name
      const name = permission[i]['name']
      // 形成按钮权限列表 roles角色 btnType按钮类型 path路径 method请求类型 api
      permissionBtn[name] = {}
      btnKey.forEach(item => {
        if (permission[i]['meta'][item]) {
          permissionBtn[name][item] = permission[i]['meta'][item]
        }
      })
      // 从路由权限中删除该按钮权限
      delete permission[i]
    } else {
      // 挂载路由
      var component = Layout
      if (permission[i].meta.type === 1 && permission[i].children && permission[i].children[0] && permission[i].children[0].path) {
        // 添加重定向地址 redirect
        permission[i].redirect = permission[i].path + '/' + permission[i].children[0].path
      } else if (permission[i].meta.type === 3) {
        // 添加本地映射
        component = resolve => require(['@/views' + parentPath + permission[i]['path']], resolve)
      }
      permission[i]['component'] = component

      // 递归 继续遍历有子节点的路由
      if (permission[i]['children']) {
        parentPath = permission[i]['path'] + '/'
        toRouter(permission[i]['children'], permissionBtn, parentPath)
      }
    }
  }
  return {
    permission: permission,
    permissionBtn: permissionBtn
  }
}

const state = {
  routers: constantRoutes,
  addRouters: [],
  permissionBtn: {},
  btnPage: {
    UserInfo: '/user/info',
    // AdminStore: '/permi/admin/create',
    // AdminUpdate: '/permi/admin/edit',

    AdminStore: '/client/admin/create',
    AdminUpdate: '/client/admin/edit',
    // AdminRecharge: '/client/chargemoney',
    // AdminRecharge: '/client/recharge',
    AdminRecharge: '/client/recharge/account',

    TipStore: '/sys/tip/create',
    TipUpdate: '/sys/tip/edit',
    TipShow: '/sys/tip/detail',

    BannerCreate: '/carousel/banner/create',
    BannerEdit: '/carousel/banner/edit',

    SvbgCreate: '/carousel/svbg/create',
    SvbgEdit: '/carousel/svbg/edit'
  },
  permissionBtnType: {
  }
}

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRoutes.concat(routers)
  },
  SET_PERMISSION_BTN: (state, permissionBtn) => {
    state.permissionBtn = permissionBtn
  }
}

const actions = {
  GenerateRoutes({
    commit,
    state
  }, data) {
    return new Promise(resolve => {
      const {
        roles,
        permission,
        btn
      } = data
      const permissionChanged = toRouter(permission)
      const accessedRouters = filterAsyncRouter(
        permissionChanged.permission,
        roles
      )
      commit('SET_PERMISSION_BTN', formatPermiBtn(btn, {}))
      commit('SET_ROUTERS', accessedRouters.concat(elseRouter))

      resolve(state.addRouters)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
