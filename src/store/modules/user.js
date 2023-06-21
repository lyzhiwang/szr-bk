import { login, getInfo, getCaptchas } from '@/api/definite'
import { apiBtn } from '@/api/default'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import store from '@/store'
import { setAreasVersion, getAreasVersion, removeAreaStorage } from '@/utils/storage'

const state = {
  userId: '',
  token: getToken(),
  roles: [],
  name: '',
  avatar: '',
  customer_video: 0, // 该用户本身是否可以开启霸屏广告
  account: 0, // 用户可开通的账号总数
  last: 0, // 用户剩余的账号总数
  ready: 0, // 用户已开通的账号总数
  accountBalance: '',
  lastLoginTime: new Date().getTime(),
  // 是否需要重置 0 不需要修改密码 1 需要修改密码
  isReset: 0,
  // 1待审核 2通过 3驳回 (3需要重新填写用户信息) 4已创建未填写任何信息
  review: 2,
  area: [],
  // 系统公告
  tip: [],
  // 代理商信息
  agentInfo: {},
  dashboardData: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_IS_OPEN_CARD: (state, is_open_card) => {
    state.is_open_card = is_open_card
  },
  SET_IS_AUTH: (state, is_authorization) => {
    state.is_authorization = is_authorization
  },
  SET_IS_OPEN_AUTH: (state, is_open_authorization) => {
    state.is_open_authorization = is_open_authorization
  },
  SET_IS_NATIONAL: (state, is_national) => {
    state.is_national = is_national
  },
  SET_CUSTOMER_VIDEO: (state, customer_video) => {
    state.customer_video = customer_video
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_LAST: (state, last) => {
    state.last = last
  },
  SET_READY: (state, ready) => {
    state.ready = ready
  },
  SET_MONEY: (state, accountBalance) => {
    state.accountBalance = accountBalance
  },
  SET_LASTLOGINTIME: (state, lastLoginTime) => {
    state.lastLoginTime = lastLoginTime
  },
  SET_IS_RESET: (state, isReset) => {
    state.isReset = isReset
  },
  SET_REVIEW: (state, review) => {
    state.review = review
  },
  SET_AREA: (state, val) => {
    state.area = val
  },
  SET_TIP: (state, hasTip) => {
    state.hasTip = hasTip
  },
  SET_AGENT: (state, val) => {
    state.agentInfo = val
  },
  SET_OPERATOR_SERVICE: (state, operator_service) => {
    state.operator_service = operator_service
  },
  SET_MARKET_SERVICE: (state, market_service) => {
    state.market_service = market_service
  },
  SET_DASHBOARD: (state, res) => {
    state.dashboardData = res
  }

}

const actions = {
  // 登录
  Login({ commit }, userInfo) {
    userInfo.username = userInfo.username.trim()
    return new Promise((resolve, reject) => {
      login({ ...userInfo }).then(response => {
        const data = response.data

        setToken(data.token)
        commit('SET_TOKEN', data.token)
        resolve({ isReset: data.isReset, review: data.review })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get captcha
  captcha() {
    return new Promise((resolve, reject) => {
      getCaptchas().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', data.roles)
        } else {
          reject('该角色不存在！')
        }

        // 地区版本号控制
        const version = data.areas_version
        if (getAreasVersion() == null) {
          setAreasVersion(version)
        } else if (getAreasVersion() !== version) {
          removeAreaStorage()
          setAreasVersion(version)
        }

        commit('SET_IS_RESET', data.is_reset)
        commit('SET_REVIEW', data.review)
        commit('SET_NAME', data.name)
        commit('SET_USER_ID', data.userId)
        commit('SET_AVATAR', data.avatar)
        commit('SET_MONEY', data.accountBalance)
        commit('SET_LASTLOGINTIME', data.lastLoginTime)
        commit('SET_AREA', data.area)
        commit('SET_TIP', data.tip)
        commit('SET_AGENT', data.agentInfo)
        commit('SET_CUSTOMER_VIDEO', data.customer_video)
        // 修改上传文件地址
        if (data.upload)store.commit('config/SET_UPLOAD', data.upload)
        commit('SET_OPERATOR_SERVICE', data.operator_service)
        commit('SET_MARKET_SERVICE', data.market_service)
        commit('SET_IS_NATIONAL', data.is_national)
        commit('SET_IS_OPEN_AUTH', data.is_open_authorization)
        commit('SET_IS_OPEN_CARD', data.is_open_card)
        commit('SET_IS_AUTH', data.is_authorization)
        resolve(response)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取账户余额
  GetAccountBalance({ commit, state }) {
    apiBtn('AccountBalance').then(res => {
      commit('SET_MONEY', res.data.accountBalance)
      commit('SET_ACCOUNT', res.data.account)
      commit('SET_LAST', res.data.last)
      commit('SET_READY', res.data.ready || 0)
    })
  },

  // 登出
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      apiBtn('UserLogout').then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 删除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_USER_ID', '')
      removeToken()
      resolve()
    })
  },

  // 获取首页信息
  getDashboardData({ commit }) {
    return new Promise((resolve, reject) => {
      apiBtn('CommonDashboard').then((res) => {
        commit('SET_DASHBOARD', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
