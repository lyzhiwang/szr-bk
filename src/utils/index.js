
import Vue from 'vue'
import { MessageBox } from 'element-ui'
import router from '@/router'
import store from '@/store'
/**
 * 格式化URL参数
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

export function datedifference(sDate1, sDate2) {
  // sDate1和sDate2是2006-12-18格式
  var dateSpan, iDays
  sDate1 = Date.parse(sDate1)
  sDate2 = Date.parse(sDate2)
  dateSpan = sDate2 - sDate1
  dateSpan = Math.abs(dateSpan)
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
  return iDays + 1
}

// 格式化时间长度
export function formatTimeLength(o, lengthTo) {
  var obj = o
  switch (typeof (o)) {
    case 'number':
      obj = lengthTo(o)
      break
    case 'string':
      obj = lengthTo(o)
      break
    case 'object':
      obj = []
      o.forEach(item => {
        obj.push(lengthTo(item))
      })
      break
  }
  return obj
}

// 将时间戳转为10位
export function formatTime10(o) {
  var lengthTo10 = (num) => num ? Number((num + '').substring(0, 10)) : ''
  return formatTimeLength(o, lengthTo10)
}

// 将时间戳转为13位
export function formatTime13(o) {
  var lengthTo13 = (num) => num ? Number(num) * 1000 : ''
  return formatTimeLength(o, lengthTo13)
}

// 遍历数组再添加元素至最后一个
export function addArrayToLast(allData, data) {
  allData = allData.push(data)
}

// 遍历数组添加指定元素
export function addArrayById(allData, data) {
  let flag = false
  const addChild = function(allData, data) {
    let i = 0
    while (!flag && i < allData.length) {
      if (allData[i].id === data.pid) {
        flag = true
        if (!allData[i].children) Vue.set(allData[i], 'children', [])
        allData[i].children.push(data)
        break
      }
      if (allData[i].children && allData[i].children.length > 0) {
        addChild(allData[i].children, data)
      }
      i++
    }
  }
  addChild(allData, data)
}

// 将时间戳转化为具体时间
export function toDates(times) {
  const date = new Date(times * 1000)
  const Y = date.getFullYear()
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
  const H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const Min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  const dateTime = Y + '-' + M + '-' + D + ' ' + H + ':' + Min + ':' + S
  return dateTime
}

// 遍历数组修改指定元素
export function modifyArrayById(allData, data) {
  let flag = false
  const updateChild = function(allData, data) {
    let i = 0
    while (!flag && i < allData.length) {
      if (allData[i].id === data.id) {
        flag = true
        for (const j in allData[i]) {
          if (Object.prototype.hasOwnProperty.call(data, j)) Vue.set(allData[i], j, data[j])
        }
        break
      }
      if (allData[i].children && allData[i].children.length > 0) {
        updateChild(allData[i].children, data)
      }
      i++
    }
  }
  updateChild(allData, data)
}

// 遍历数组删除指定元素
export function deleteArrayById(allData, id) {
  let flag = false
  const deleteChild = function(allData, id) {
    let i = 0
    while (!flag && i < allData.length) {
      if (allData[i].id === id) {
        flag = true
        allData.splice(i, 1)
        break
      }
      if (allData[i].children && allData[i].children.length > 0) {
        deleteChild(allData[i].children, id)
        Vue.set(allData[i], 'children', allData[i].children)
      }
      i++
    }
  }
  deleteChild(allData, id)
}

// 查找数组中id最大值
export function checkIdBiggest(pData) {
  let num = pData[0]['id']
  // 数组
  for (const data of pData) {
    if (data.id > num) num = data.id
    if (data.children) {
      const cnum = checkIdBiggest(data.children)
      if (cnum > num) num = cnum
    }
  }
  return num
}

// 获取上传文件（图片）的宽高
export function getPicSize(file) {
  return new Promise((resolve, reject) => {
    // 创建对象
    var fReader = new FileReader()
    // 读取图片
    fReader.readAsDataURL(file)
    const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png')
    if (isJPG) {
      // 读取图片过程
      fReader.onload = function() {
        var img = new Image()
        img.src = fReader.result
        img.onload = function() {
          resolve({ res: 'success', el: img, width: img.width, height: img.height })
        }
      }
    } else reject({ res: 'error', message: '图片类型只能是 JPG 或 PNG 格式' })
  })
}

// 生成随机数
export function Random(length) {
  this.length = length
}
Random.prototype.init = function() {
  this.password = ''
  var $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789'
  var max = $chars.length
  for (var i = 0; i < this.length; i++) {
    this.password += $chars.charAt(Math.floor(Math.random() * max))
  }
  this.validate(this.password)
  return this.password
}
Random.prototype.validate = function(password) {
  var reg = /([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*/
  if (reg.test(password)) {
    return true
  } else {
    this.init()
  }
}

// 删除提示封装
export function defalultConfirm(msg, callBack, catchBack) {
  MessageBox.confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    callBack()
  }).catch(() => {
    if (catchBack) catchBack()
  })
}

// 按钮跳转页面
export function toRedirect(name, query) {
  var path = store.getters.btnPage[name]
  router.push({
    path,
    query
  })
}
