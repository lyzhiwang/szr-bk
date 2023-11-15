import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import { MessageBox } from 'element-ui'

import { parseTime, formatTime } from './filter'
import { apiBtn } from '@/api/default'

/**
 *该混入组件只用于定义全局复用方法
 * 不书写业务逻辑
 */
Vue.mixin({
  data() {
    return {
      // 定义角色
      rolesEnum: {
        1: 'admin',
        7: 'operation',
        8: 'account',
        9: 'agent',
        10: 'store'
      }
    }
  },
  methods: {
    // 检查某个用户是否属于某些角色
    // 不传第二个参数默认取当前用户角色，传第二个参则校验指定参数
    checkRole(roles, checkRole) {
      return roles.includes(this.rolesEnum[checkRole || this.$store.state.user.roles[0]])
    },
    // 下载excel表格
    // apiName, params, excelHeader, excelFilter, excelTitle
    defaultExportToExcel(obj) {
      this.apiBtn(obj.apiName, obj.params)
        .then(res => {
          // excel数据导出
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require('@/excel/Export2Excel')
            const list = res.data.list
            const data = this.formatJson(obj.excelFilter, list)
            export_json_to_excel(obj.excelHeader, data, obj.excelTitle)
          })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 请求
    apiBtn,
    // 格式化时间
    parseTime,
    formatTime,
    // 二次提示封装
    defalultConfirm(msg, callBack, catchBack) {
      MessageBox.confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callBack()
      }).catch(() => {
        if (catchBack) catchBack()
      })
    },

    // 获取文件类型
    getFileName(number) {
      const fileType = {
        1: 'img', // 图片
        2: 'video', // 完整视频
        3: 'video', // 素材视频
        4: 'audio', // 配音
        5: 'audio', // BGM
        6: 'img', // 图片 自定义海报
        8: 'text', // 字幕
        9: 'img', // 图片 视频素材图片
        10: 'video', // 片头
        11: 'audio', // 背景音乐库
        12: 'img',
        13: 'audio', // 配音和字幕
        19: 'exe', // 安装包
        20: 'audio' // 音频
      }
      return fileType[number]
    },

    // 获取任意长度的随机数字字母组合字符串 @param {*} len 随机字符串的长度
    randomString(len) {
      // console.log(len, 'mixinleng')
      const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      return this._.sampleSize(charSet, len).toString().replace(/,/g, '')
    },

    // 通过path跳转
    toRedirect(name, query) {
      var path = store.getters.btnPage[name]
      router.push({
        path,
        query
      })
    },
    // 通过name跳转 刷新后params参数会丢失
    toRedirectByName(name, params) {
      router.push({
        name: name,
        params
      })
    },
    // 删除属性为空的值
    removeProperty(object) {
      for (const prop in object) {
        // if (object[prop] === 0) break
        if ((!object[prop] || object[prop].length === 0) && object[prop] !== 0) {
          delete object[prop]
        }
        if (typeof (object[prop]) === 'object') this.removeProperty(object[prop])
      }
      return object
    },
    // 深度拷贝
    deepClone(obj) {
      const _toString = Object.prototype.toString

      // null, undefined, non-object, function
      if (!obj || typeof obj !== 'object') {
        return obj
      }

      // DOM Node
      if (obj.nodeType && 'cloneNode' in obj) {
        return obj.cloneNode(true)
      }

      // Date
      if (_toString.call(obj) === '[object Date]') {
        return new Date(obj.getTime())
      }

      // RegExp
      if (_toString.call(obj) === '[object RegExp]') {
        const flags = []
        if (obj.global) { flags.push('g') }
        if (obj.multiline) { flags.push('m') }
        if (obj.ignoreCase) { flags.push('i') }

        return new RegExp(obj.source, flags.join(''))
      }

      const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

      for (const key in obj) {
        result[key] = this.deepClone(obj[key])
      }

      return result
    }
  }
})
