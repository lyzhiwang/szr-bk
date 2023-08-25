import { apiBtn } from '@/api/default'

const state = {
  // 是否上传到七牛云：0本地，1七牛
  auto_open: 0,
  // 服务器图片上传地址
  local_url: process.env.VUE_APP_BASE_API + '/upload',
  upload_url: '', // 上传地址
  imgToken: null, // 上传图片时，携带的token
  audioToken: null, // 上传音乐
  aliToken: null, // 阿里token
  // 角色列表
  roleList: [],
  review_location: 'https://qr.zwmstk.cn/review', // 前台H5页面核销地址
  wx_login_location: 'https://qr.zwmstk.cn/api/wechat/login', // 微信登录跳转链接
  wx_bind_location: 'https://qr.zwmstk.cn/api/wechat/auth'// 绑定微信跳转链接
}
const mutations = {
  SET_IMG_TOKEN(state, token) {
    state.imgToken = token
  },
  SET_AUDIO_TOKEN(state, token) {
    state.audioToken = token
  },
  SET_ROLE_LIST(state, list) {
    state.roleList = list
  },
  // 设置上传参数
  SET_UPLOAD(state, upload) {
    state.auto_open = upload.open ? Number(upload.open) : 0
    state.upload_url = upload.open ? upload.qiniu_url : upload.local_url
    state.local_url = upload.local_url
  },
  SET_ALI_TOKEN(state, token) {
    state.aliToken = token
  }
}

const actions = {
  // params = { other: true } 表示获取音乐的token
  // 不携带 params表示只获取上传图片的token
  GetQiniuToken({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      // 上传至本地状态下 不再请求七牛接口
      if (state.auto_open === 0) {
        resolve()
        return
      }
      if (!params && !state.imgToken) {
        apiBtn('QiniuToken')
          .then(res => {
            // commit('SET_IMG_TOKEN', res.data)
            commit('SET_IMG_TOKEN', res.data.qiniuToken)

            resolve(resolve)
          })
          .catch(res => {
            reject(res)
          })
      }

      if (params && !state.audioToken) {
        apiBtn('QiniuToken', { ...params })
          .then(res => {
            commit('SET_IMG_TOKEN', res.data.img)
            commit('SET_AUDIO_TOKEN', res.data.audio)
            resolve(resolve)
          })
          .catch(res => {
            reject(res)
          })
      }
    })
  },
  GetRoleList({ commit }, params) {
    return new Promise((resolve, reject) => {
      apiBtn('RoleIndex', params)
        .then(res => {
          commit('SET_ROLE_LIST', res.data)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  // 获取阿里token
  GetAliToken({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      // 上传至本地状态下 不再请求阿里接口
      if (state.auto_open === 0) {
        resolve()
        return
      }
      if (!params && !state.aliToken) {
        apiBtn('AliToken')
          .then(res => {
            commit('SET_ALI_TOKEN', res.data)
            resolve(resolve)
          })
          .catch(res => {
            reject(res)
          })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
