import Vue from 'vue'

// 将完整的路由转换成下拉菜单可用的数据
export function getAuthorityOption(arr, result, before) {
  if (!result) {
    result = [{
      id: 0,
      title: '顶级权限',
      type: 0,
      name: null
    }]
  }
  if (!before) before = ''
  for (let item in arr) {
    item = arr[item]
    if (item.meta.type !== 2) {
      result.push({
        id: item.id,
        title: before + item.meta.title,
        type: item.meta.type,
        name: item.name
      })
    }
    if (item.children) {
      result = getAuthorityOption(item.children, result, '|--')
    }
  }
  return result
}

// 将完整的路由转换成分组数据
export function getAGroupOption(arr) {
  var result = []
  for (let item in arr) {
    item = arr[item]
    if (item.meta.type === 1) {
      result.push({
        id: item.id,
        title: item.meta.title
      })
    }
  }
  return result
}

// 将完整的路由转换成页面
export function getAPageOption(arr, result, before) {
  if (!result) {
    result = []
  }
  if (!before) before = ''
  for (let item in arr) {
    item = arr[item]
    if (item.meta.type === 3) {
      result.push({
        id: item.id,
        title: before + item.meta.title,
        name: item.name
      })
    }
    if (item.children) {
      result = getAuthorityOption(item.children, result, item.meta.title + '  /  ')
    }
  }
  return result
}

// 将完整的路由转换成tree可用的数据
export function getAuthorityTree(arr) {
  for (let item in arr) {
    item = arr[item]
    if (item.children && item.children.length > 0) {
      Vue.set(item, 'label', item.meta.title)
      Vue.set(item, 'children', getAuthorityTree(item.children))
    } else {
      Vue.set(item, 'label', item.meta.title)
    }
  }
  return arr
}

// 格式化按钮格式
const btnKey = ['roles', 'btnType', 'path', 'method', 'api']
export function formatPermiBtn(res, per) {
  for (let i = 0; i < res.length; i++) {
    var obj = res[i]
    // 获取权限名称
    const name = res[i]['name']
    // 初始化权限对象
    per[name] = {}
    // 为权限对象赋属性
    btnKey.forEach(item => {
      if (obj.meta[item]) {
        per[name][item] = obj.meta[item]
      }
    })
  }
  return per
}
