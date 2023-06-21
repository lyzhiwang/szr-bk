import request from '@/utils/request'

/*

视频列表开始

*/

// 获取视频列表
export function getVideoList(params) {
  return request({
    url: '/video',
    method: 'get',
    params
  })
}

// 根据id查询视频详情

export function getVideo(id) {
  return request({
    url: '/video/' + id,
    method: 'get'
  })
}

/*

视频资源开始

*/

// 资源列表

export function getResourceList(params) {
  return request({
    url: '/resource',
    method: 'get',
    params
  })
}

// 删除资源+id
export function delResource(id) {
  return request({
    url: '/resource/' + id,
    method: 'delete'
  })
}

// 恢复删除资源+id
export function recovery(id) {
  return request({
    url: '/resource/' + id,
    method: 'patch'
  })
}

/*

视频分类开始

*/

// 查询分类列表
export function getCategoryList(params) {
  return request({
    url: '/category',
    method: 'get',
    params
  })
}

// 新增分类
export function addCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data: data
  })
}
// 编辑分类
export function editCategory(data) {
  return request({
    url: '/category/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除分类+id
export function delCategory(id) {
  return request({
    url: '/category/' + id,
    method: 'delete'
  })
}

// 恢复删除分类+id
export function recoveryCategory(id) {
  return request({
    url: '/category/' + id,
    method: 'patch'
  })
}

// 退出登录接口+id
export function userLogout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}
