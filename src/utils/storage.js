// 行政区域
export function setAreaStorage(list) {
  const CircularJSON = require('circular-json')
  return localStorage.setItem('area', CircularJSON.stringify(list))
}

export function getAreaStorage() {
  if (localStorage.getItem('area')) {
    return JSON.parse(localStorage.getItem('area'))
  } else {
    return []
  }
}

export function removeAreaStorage() {
  return localStorage.removeItem('area')
}

// 获取通用地址列表 用于解析code码生成完整地址信息
export function setCommonAreaStorage(list) {
  const CircularJSON = require('circular-json')
  return localStorage.setItem('common_area', CircularJSON.stringify(list))
}

export function getCommonAreaStorage() {
  if (localStorage.getItem('common_area')) {
    return JSON.parse(localStorage.getItem('common_area'))
  } else {
    return ''
  }
}

// 地区版本号
export function setAreasVersion(param) {
  return localStorage.setItem('areas_version', JSON.stringify(param))
}

export function getAreasVersion(param) {
  if (localStorage.getItem('areas_version') !== 'undefined') {
    return JSON.parse(localStorage.getItem('areas_version'))
  } else {
    return null
  }
}

