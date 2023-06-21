import request from '@/utils/request'
import store from '@/store'
// import router from '@/router'
import { Message } from 'element-ui'

// 按钮请求封装
export function apiBtn(name, data) {
  // 未传递请求方法名称
  if (!name) {
    Message({
      message: '按钮名称未传递',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject('按钮名称未传递')
  }
  // 获取请求内容

  var o = store.getters.permissionBtn[name]
  if (!o || !o.api || !o.method) {
    Message({
      message: name + '不存在',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject('API或请求方式不存在')
  }

  // 封装请求参数
  var r = {
    url: o.api,
    method: o.method
  }

  if (o.method !== 'GET') r.data = data
  else r.params = data

  if (o.method !== 'POST' && data && data.id) {
    r.url = o.api + '/' + data.id
    delete data['id']
  }

  // 请求
  return request(r)
}

// 获取页面列表
// export function apiIndex(url, params) {
//   if (!url) {
//     Message({
//       message: '请求地址错误',
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return
//   }
//   url = url.slice(url.indexOf('/') + 1, url.lastIndexOf('/'))
//   url = url.slice(url.indexOf('/'), url.length)

//   if (!url) {
//     Message({
//       message: '请求地址错误',
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return
//   }

//   if (params && params.id) url = url + '/' + params.id

//   return request({
//     url: url,
//     method: 'get',
//     params
//   })
// }

// // 新增 编辑页面 获取基础配置
// export function apiRederict(name, query) {
//   if (!name) {
//     Message({
//       message: '按钮名称未传递',
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return
//   }
//   var path = store.getters.btnPage[name]
//   router.push({
//     path,
//     query
//   })
//   var keys = ['Create', 'Edit']
//   var url = ''
//   for (const item in keys) {
//     if (name.includes(item)) {
//       var u = name.split(item)[0]
//       url = `/${u}${(query && query.id) ? ('/' + query.id) : ''}/${item.toLowerCase()}`
//       return
//     }
//   }
//   if (url) {
//     return request({
//       url: url,
//       method: 'get',
//       params: query
//     })
//   }
// }
