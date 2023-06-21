import request from '@/utils/request'

// 获取验证码
export function getCaptchas() {
  return request({
    url: '/captchas',
    method: 'get'
  })
}

// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
// 刷新token
export function refreshToken() {
  return request({
    url: '/user/refresh',
    method: 'get'
  })
}

// 获取登录信息
export function getInfo(params) {
  return request({
    url: '/common/info',
    method: 'get',
    params
  })
}

// 微信绑定jump
export function authback(params) {
  return request({
    url: '/wechat/authback',
    method: 'get',
    params
  })
}

// 微信 登录 没有权限也可以进
export function callback(params) {
  return request({
    url: '/wechat/callback',
    method: 'get',
    params
  })
}

// 公众号菜单
// // 查询菜单
// export function queryMenu(params) {
//   return request({
//     url: '/wechat/menu',
//     method: 'get',
//     params
//   })
// }

// // 创建菜单
// export function createMenu(data) {
//   return request({
//     url: '/wechat/menu',
//     method: 'post',
//     data
//   })
// }

// // 删除菜单
// export function deleteMenu(params) {
//   return request({
//     url: '/wechat/menu',
//     method: 'delete',
//     params
//   })
// }
