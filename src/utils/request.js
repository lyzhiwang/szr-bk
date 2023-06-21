import axios from 'axios'
import store from '../store'
import { Message, MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

// http响应状态码
const resposeCode = {
  '301': '请求需要重定向',
  '400': '请求错误',
  '401': '请求受保护，需要填写用户名字/密码',
  '403': '资源不可用',
  '404': '无法找到指定资源',
  '405': '请求方法错误',
  '406': '页面请求头不兼容',
  '407': '服务器授权后方可使用',
  '408': '请求超时，请重试',
  '409': '当前资源被占用',
  '410': '请求资源已过期',
  '413': '请求文件过大',
  '423': '当前资源被锁定',
  '424': '请求关联错误',
  '500': '服务器错误',
  '501': '服务器不支持您的请求',
  '502': '上游服务器无法响应',
  '503': '服务器维护中，请稍后再试',
  '504': '上游服务器未及时应答',
  '510': '策略未满足',
  '600': '响应头未返回'
}

// 是否测试
const isDEBUG = false

// 设置全局的请求次数，请求的间隙
axios.defaults.retry = 2
axios.defaults.retryDelay = 1000

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 3000, // 请求超时时间
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)
// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    const status = response.status
    if (isDEBUG) console.log(response)
    if (res) {
      // 提示信息
      if (res.message) {
        Message({
          message: res.message,
          type: res.code === 0 ? 'success' : 'error',
          duration: 5 * 1000
        })
      }
      if (res.code === 0) { // code 为0请求正常
        return res
      } else {
        /**
         * '700003' => '认证失败',
         * '700004' => '当前用户已经过期'
         */
        if (res.code === 700003) {
          store.dispatch('user/resetToken')
          location.reload()
        }
        if (res.code === 700004) {
          MessageBox.alert(
            '页面超时，请重新登录',
            '确定登出', {
              confirmButtonText: '重新登录',
              type: 'warning',
              callback: action => {
                store.dispatch('user/LogOut').then(() => {
                  location.reload() // 为了重新实例化vue-router对象 避免bug
                })
              }
            }
          )
        }
        return Promise.reject(res)
      }
    } else {
      Message({
        message: resposeCode[status] || '请求成功，返回值错误',
        type: 'error',
        duration: 3000,
        showClose: true
      })
      return Promise.reject('error', response)
    }
  },
  error => {
    if (isDEBUG) console.error('error' + error) // for debug
    const response = error.response || { status: 404 }
    const status = response.status
    /**
    // 请求服务器失败重新请求
    var config = error.config
    // 如果config不存在或未设置重试选项，请拒绝
    if (!config || !config.retry) return Promise.reject(error)

    // 设置变量以跟踪重试次数
    config.__retryCount = config.__retryCount || 0

    // 检查我们是否已经最大化了重试次数
    if (config.__retryCount >= config.retry) {
      // Reject with the error
      Message({
        message: resposeCode[status] || '网络错误，请重新尝试',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }

    // 增加重试次数
    config.__retryCount += 1

    // 创建一个promise，控制请求次数
    var backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, config.retryDelay || 1)
    })

    // 返回axios 重试请求
    return backoff.then(function() {
      return axios(config)
    })
    */
    Message({
      message: resposeCode[status] || '网络错误，请重新尝试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
