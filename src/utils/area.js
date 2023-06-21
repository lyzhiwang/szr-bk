import Vue from 'vue'
import { getAreaStorage } from '@/utils/storage'

// 新增地区
export function addChildren(list, event) {
  let flag = false
  const addChild = function(list, event) {
    let i = 0
    while (!flag && i < list.length) {
      const item = list[i]

      if (item.id === event.pid) {
        flag = true
        const arr = item.children || []
        arr.push(event)
        Vue.set(item, 'children', arr)
        break
      }

      if (item.children && item.children.length) {
        addChild(item.children, event)
      }
      i++
    }
  }
  addChild(list, event)
}

// 修改地区
export function updateChildren(list, event) {
  let flag = false
  const updateChild = (list, event) => {
    let i = 0
    while (!flag && i < list.length) {
      if (list[i].id === event.id) {
        flag = true
        Vue.set(list[i], 'id', event.newId)
        Vue.set(list[i], 'name', event.name)
        break
      }
      if (list[i].children && list[i].children.length) {
        updateChild(list[i].children, event)
      }
      i++
    }
  }
  updateChild(list, event)
}

/**
 * 根据id查找name
 * 模拟栈
 * 获取完整地址, 返回参数[{id:1, name:'', pid: 1},...]
 */

function Stack() {
  var items = []
  // 添加一个元素到栈顶
  this.push = function(item) {
    items.push(item)
  }

  // 弹出栈顶元素
  this.pop = function() {
    return items.pop()
  }

  // 返回栈顶元素
  this.top = function() {
    return items[items.length]
  }

  // 栈是否为空
  this.isEmpty = function() {
    return items.length === 0
  }

  // 栈长度
  this.size = function() {
    return items.length
  }

  // 清空栈
  this.clear = function() {
    this.items = []
  }
  this.get = function() {
    return items
  }
}

/**
 * 1.创建、编辑用户：获取三级完整地区
 * 2.创建、编辑活动：获取用户地区，不获取上级
 *    全国，不做处理
 *    市级代理：返回当前市，包括子级地区
 *    县级代理：返回市级地区，包括当前市的children
*/
export function getCity(id, complete) {
  const area = new Stack()
  const storage = getAreaStorage()
  let flag = false

  function recursive(area, list, id, complete) {
    let i = 0
    while (!flag && i < list.length) {
      /**
       * 入栈 条件：
       * 1、id相等，返回栈, 跳出多层嵌套循环
       * 2、含有children 查看子集是否含有相应id
       */
      const item = list[i]
      if (item.id === Number(id)) {
        flag = true
        area.push({
          'name': item.name,
          'id': item.id,
          'pid': item.pid,
          'children': item.children || []
        })
        break
      }

      if (item.children && item.children.length > 0) {
        if (complete === true) {
          // 将item添加到栈
          area.push({
            'name': item.name,
            'id': item.id,
            'pid': item.pid
          })
        }
        // 循环item.children
        recursive(area, item.children, id, complete)
      }

      i++
    }
    // 出栈条件：此一层for循环下都不含有对应id且不含有children字段
    if (!flag) area.pop()
  }

  recursive(area, storage, id, complete)
  return area.get()
}
