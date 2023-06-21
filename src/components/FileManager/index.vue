<template>
  <div class="file-manager">
    <!-- 展示框 -->
    <div v-if="type === 1" class="music">
      <el-input v-model="value.name" disabled clearable placeholder="请设置音乐">
        <template #append>
          <el-button :disabled="disabled" @click="toggleDialog">选择文件</el-button>
        </template>
      </el-input>
    </div>
    <!-- :class="['pic', disabled ? 'cursor-disabled' : 'cursor-pointer']" -->
    <div v-else :class="['pic', 'cursor-pointer']">
      <div v-if="value.path" :class="['img-box', 'img-box-border', value.path ? 'has-img' : 'no-img']">
        <img :src="value.path">
        <span class="icon">
          <i class="el-icon-zoom-in" @click="preview=true" />
          <i v-if="!disabled" class="el-icon-edit" @click="toggleDialog" />
          <i v-if="!disabled" class="el-icon-delete" @click="deleteItem" />
        </span>
      </div>
      <div v-else :class="['plus', disabled ? 'cursor-disabled' : 'cursor-pointer', value.path ? 'has-img' : 'no-img']" @click="toggleDialog">
        <i class="el-icon-plus avatar-uploader-icon" />
      </div>
    </div>

    <!-- 文件管理 -->
    <div v-show="isVisible" class="file-list">
      <div class="header">
        <span>文件管理</span>
        <i class="el-icon-close" @click="toggleDialog" />
      </div>

      <div class="content">
        <!-- 音乐 -->
        <template v-if="type === 1 && list && list.length">
          <div v-for="(item, index) in list" :key="index" :class="['img-box', 'music', select.index === index ? 'img-box-border' : '']" @dblclick="changeItem(item, index)" @touchend="changeItem(item, index)" @mouseover="mouserOver(item, index)">
            <p :title="item.name" class="ellipsis">{{ item.name }}</p>
            <p>{{ item.add_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</p>
          </div>
        </template>
        <!-- 图片 -->
        <template v-else-if="list && list.length">
          <div v-for="(item, index) in list" v-show="index < 8" :key="index" :class="['img-box', select.index === index ? 'img-box-border' : '']" @dblclick="changeItem(item, index)" @touchend="changeItem(item, index)" @mouseover="mouserOver(item, index)">
            <img :src="item.path">
            <div class="img-info ellipsis">
              <p :title="item.name" class="name ellipsis">{{ item.name }}</p>
              <p>
                <!-- <span>{{ item.size | fileSize }}</span> -->
                <span>{{ item.size }}</span>
                <span> - </span>
                <span>{{ item.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </p>
            </div>
          </div>
        </template>
        <!-- 空 -->
        <template v-else>
          <span class="img-box music">暂无数据</span>
        </template>
      </div>

      <!-- 翻页 -->
      <div class="foot">
        <el-upload :auto-upload="!isInfo" :action="upload_url" :data="params" :headers="headers" :before-upload="beforeUpload" :on-change="changeUpload" :on-success="handleSuccess" :on-error="handleError" :show-file-list="false">
          <el-button type="primary" size="mini" class="el-icon-upload">本地上传</el-button>
        </el-upload>
        <el-button size="mini" @click="nextPage">下一页</el-button>
        <el-button size="mini" @click="lastPage">上一页</el-button>
      </div>
    </div>

    <!-- 预览 -->
    <div v-show="preview" class="el-dialog__wrapper" style="z-index: 2005;">
      <div role="dialog" aria-modal="true" aria-label="dialog" class="el-dialog" style="margin-top: 10vh;">
        <div class="el-dialog__header">
          <span class="el-dialog__title" />
          <button type="button" class="el-dialog__headerbtn" @click="preview=false"><i class="el-dialog__close el-icon el-icon-close" /></button>
        </div>
        <div class="el-dialog__body" style="text-align: center;">
          <img style="max-width:500px;" :src="value.path" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import Watermark from '@/utils/watermark.js'

export default {
  props: {
    /**
     * type
     * 1音乐，
     * 2顶部背景，
     * 3公众号二维码，
     * 4富文本框，
     * 6用户信息（需要加水印 所以手动上传上传），
     * 7商品图，
     * 8分享图片，
     * 9用户头像，
     * 10 首屏广告，
     * 12 霸屏广告
     */
    type: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number || String,
      default: 8
    },
    value: {
      type: Object,
      default() {}
    },
    size: {
      type: Number || String,
      default: 100
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 仅用于 type=6 用户信息上传 添加水印信息
    watermark: {
      type: String,
      default: '该证件仅用于数字人使用'
    }
  },
  data() {
    return {
      preview: false,
      isVisible: false,
      select: { item: {}, index: -1 },
      list: [],
      total: 0,
      page: 1
    }
  },
  computed: {
    params: function() {
      const config = this.$store.state.config
      const token = this.type === 1 ? config.audioToken : config.imgToken
      if (config.auto_open && this.type !== 6) {
        return {
          token: token,
          'x:type': this.type
        }
      } else {
        return {
          token: token,
          type: this.type
        }
      }
    },
    fileType() {
      const fileType = {
        1: 'audio', // 音乐
        2: 'img', // 顶部背景
        3: 'img', // 公众号二维码
        4: 'img', // 富文本框
        6: 'img', // 用户信息（需要加水印 所以手动上传上传）
        7: 'img', // 商品图
        8: 'img', // 分享图片
        9: 'img', // 用户头像
        10: 'img', // 首屏广告
        12: 'img', // 霸屏广告
        13: 'video' // 视频
      }
      return fileType[this.type]
    },
    upload_url: function() {
      // 用户信息（身份证，营业执照）必须上传服务器，不上传七牛
      const config = this.$store.state.config
      if (config.auto_open) return (this.type === 6) ? config.local_url : config.upload_url
      else return config.local_url
    },
    headers: function() {
      return {
        Authorization: 'Bearer ' + getToken()
      }
    },
    // 用户信息需要加水印所以需要手动上传
    isInfo: function() {
      return this.type === 6
    }
  },
  watch: {
    isVisible: function(val) {
      if (val) {
        this.getList()
      }
    },
    value: function() {
      this.select.item = this.value
    },
    page: function() {
      this.getList()
    }
  },
  created() {
    if (this.isQiniu) this.$store.dispatch('config/GetQiniuToken', { file_type: this.fileType })
  },
  methods: {
    // 所选值发生改变
    mouserOver(item, index) {
      this.select = { item: item, index: index }
    },
    deleteItem() {
      this.select = { item: {}, index: -1 }
      this.$emit('change', this.select.item)
    },
    changeItem(item, index) {
      this.select = { item: item, index: index }
      this.$emit('change', item)
      if (item && item.id && item.path && item.name) this.toggleDialog()
    },
    // 获取列表
    getList() {
      this.apiBtn('UploadIndex', { page: this.page, type: this.type, size: this.pageSize })
        .then(res => {
          this.list = res.data
          this.total = res.meta.total
        })
    },
    // 翻页
    lastPage() {
      if (this.page === 1) {
        this.$message({
          type: 'info',
          message: '当前页面为第一页'
        })
      } else {
        this.page = this.page - 1
      }
    },
    nextPage() {
      const can = Math.ceil(this.total / (this.type === 1 ? 16 : 8))
      if (can <= this.page) {
        this.$message({
          type: 'info',
          message: '当前页面为最后一页'
        })
      } else {
        this.page = this.page + 1
      }
    },
    toggleDialog() {
      if (!this.disabled) {
        this.isVisible = !this.isVisible
        if (this.isVisible) { // 每次打开初始化数据
          this.page = 1
          this.select = { item: {}, index: -1 }
        }
      }
    },
    // 上传成功
    handleSuccess(res, file, list) {
      if (res.code === 0) {
        const obj = res.data
        // {
        //   id: res.data.id,
        //   path: res.data.path,
        //   name: file.name,
        //   size: file.size,
        //   add_time: Date.parse(new Date())
        // }
        this.list.unshift(obj)
      } else {
        this.$message({
          type: 'error',
          message: res.message || '网络错误，请重新尝试'
        })
      }
    },
    // 上传失败
    handleError(err, file, list) {
      err = JSON.parse(JSON.stringify(err))
      if (err.status === 401) {
        this.$store.dispatch('config/GetQiniuToken', { file_type: this.fileType })
          .then(res => {
            this.req(file)
          })
      } else this.$message.error('文件上传失败')
    },
    // 上传限制
    beforeUpload(file) {
      // 文件名
      const isLt2M = file.size / 1024 < this.size
      if (!isLt2M) {
        const sizeStr = this.size < 1024 ? this.size + 'KB' : (this.size / 1024) + 'MB'
        this.$message.error('文件大小不能超过 ' + sizeStr + '!')
      }
      const isJPG = this.type === 1 ? (file.type === 'audio/mp3' || file.type === 'audio/mpeg') : (file.type === 'image/jpeg') || (file.type === 'image/png')
      if (!file.type || !isJPG) {
        const msg = this.type === 1 ? 'mp3 格式' : ' JPG 或 PNG 格式!'
        this.$message.error('上传文件只能是' + msg)
      }
      return isJPG && isLt2M
    },
    // change事件触发 用户信息相关图片水印需要加水印故需要手动上传
    changeUpload(file) {
      if (this.isInfo) {
        // 校验格式
        if (this.beforeUpload(file.raw)) {
          // 添加水印
          this.makeWatermarke(file)
            .then((imgurl) => {
              file = this.dataURLtoFile(imgurl, 'img' + new Date().getTime())
              // 上传
              this.req(file)
            })
        } else {
          return false
        }
      }
    },
    makeWatermarke(file) {
      return new Promise((resolve, reject) => {
        Watermark.toWatermark(file.raw, (imgurl) => {
          this.imgList = [{ url: imgurl }]
          resolve(imgurl)
        }, {
          cwOption: { text: this.watermark },
          imgOption: { size: 1600 } // 图片宽高不超过这个大小 单位为像素
        })
      })
    },
    // 手动触发上传到服务器
    req(file) {
      const formData = new FormData()
      for (var key in this.params) {
        formData.append(key, this.params[key])
      }
      if (this.isInfo) formData.append('file', file)
      else formData.append('file', file.raw, file.name)
      request({
        baseURL: '',
        url: this.upload_url,
        method: 'post',
        data: formData
      }).then(res => {
        this.handleSuccess(res)
      }).catch(err => {
        this.handleError(err)
      })
    },
    // base64 转 File
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      // 转换成file对象
      return new File([u8arr], filename, {
        type: mime
      })
      // 转换成成blob对象
      // return new Blob([u8arr],{type:mime});
    },
    getCurrentTime() {
      const date = new Date()
      const m = date.getMonth() + 1
      const d = date.getDate()
      const h = date.getHours()
      const mi = date.getMinutes()
      const s = date.getSeconds()
      var month = (m >= 1 || m <= 9) ? '0' + m : m
      var day = (d >= 0 && d <= 9) ? '0' + d : d
      var hour = (h >= 0 && h <= 9) ? '0' + h : h
      var minute = (mi >= 0 && mi <= 9) ? '0' + mi : mi
      var second = (s >= 0 && s <= 9) ? '0' + s : s
      return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '@/styles/variables.scss';
.file-manager {
  // 文本
  .music {
    ::v-deep .el-input__inner {
      background: #fff;
      cursor: auto;
    }
    p:first-child {
      width: 50%;
    }
    p:nth-child(2) {
      flex: 0 1 auto;
    }
  }
  // 图片
  .pic {
    width: 120px;
    height: 120px;
    font-size: 20px;
    border-radius: 6px;
    overflow: hidden;
    .plus {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      color: #3b3a3a;
      border: 1px dashed #d9d9d9;
      border-radius: 5px;
    }

    .img-box-border {
      border: 1px solid $mainColor;
      border-radius: 5px;
    }

    .img-box {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        display: none;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 100%;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
        transform: translate(-50%, -50%);
      }
    }
    .has-img:hover .icon {
      display: flex;
    }
    .no-img:hover {
      border-color: $mainColor;
    }
  }
  .file-list {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 698px;
    height: 509px;
    color: #595959;
    // font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    background: #c5c5c5;
    border: 1px solid #c5c5c5;
    transform: translate(-50%, -50%);
    transition: transform 1000ms ease-in, opacity 150ms ease-in;
    z-index: 999;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      font-weight: 600;
      background-color: #fff;
      border-bottom: 1px solid #c5c5c5;
      .el-icon-close {
        color: #9b9b9b;
        font-weight: 600 !important;
        cursor: pointer;
      }
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      max-height: 416px;
      overflow-y: auto;
      .img-box {
        position: relative;
        display: flex;
        align-items: center;
        width: calc(50% - 4px);
        height: 100px;
        margin: 2px;
        background-color: #fff;
        border: 2px solid #fff;
        img {
          width: 80px;
          height: 80px;
          margin: 0 10px;
        }
        .img-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          p {
            margin: 0;
            line-height: 20px;
            span {
              color: #929292;
              font-size: 12px;
            }
          }
          .name {
            font-weight: 700;
          }
        }
        .el-button {
          position: absolute;
          right: 10px;
          bottom: 6px;
          padding: 4px 11px;
        }
      }
      .img-box-border {
        border: 2px solid $mainColor;
      }
      .music {
        justify-content: space-between;
        height: 48px;
        padding: 0 10px;
      }
    }
    .foot {
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      width: 100%;
      padding: 4px 10px;
      background-color: #fff;
      border-top: 1px solid #c5c5c5;
      .el-button {
        height: 31px;
        margin-left: 10px;
      }
    }
  }
}
</style>
