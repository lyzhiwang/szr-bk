<template>
  <div>
    <el-upload
      :id="uploadId"
      :auto-upload="!hasWatermark"
      :action="action"
      :file-list="fileList"
      :headers="headers"
      :data="data"
      :accept="accept"
      :limit="limit"
      :multiple="multiple"
      :drag="drag"
      :list-type="!drag&&fileType==='img'?'picture-card':''"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :on-err="handleError"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
    >
      <template v-if="drag">
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </template>
      <template v-else>
        <i v-if="fileType==='img'" class="el-icon-plus" />
        <el-button v-else size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">{{ messageType }},且{{ messageSize }}</div>
      </template>

    </el-upload>
    <!-- 预览 -->
    <preview-dialog :is-visible="dialogVisible" :type="fileType" :src="previewSrc" @close="dialogVisible=false" />
  </div>
</template>
<script>
import PreviewDialog from './PreviewDialog.vue'

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import Watermark from '@/utils/watermark.js'

export default {
  components: { PreviewDialog },
  props: {
    // 多文件上传
    multiple: {
      type: Boolean,
      default: false
    },
    // 限制上传图片个数，默认为1
    limit: {
      type: Number,
      default: 1
    },
    // 上传列表
    list: {
      type: [Array, Object, String],
      default() { }
    },
    // 上传大小限制 单位为 KB
    sizeLimit: {
      type: Number,
      default: 1024
    },
    // 请求携带参数 type
    params: {
      type: Object,
      default() { return {} }
    },
    // 返回参数
    rParams: {
      type: Object,
      default() { return {} }
    },
    // 是否是拖拽上传
    drag: {
      type: Boolean,
      default: true
    },
    // 指定上传至后台
    uploadSafe: {
      type: Boolean,
      default: false
    },
    // 是否添加水印
    hasWatermark: {
      type: Boolean,
      default: false
    },
    // 水印添加文字
    text: {
      type: String,
      default: '该证件仅用于*****使用,15个字'
    }
  },
  data() {
    return {
      dialogVisible: false,
      previewSrc: '',
      uploadId: 'upload' + new Date().getTime(),
      // 展示上传过的图片需要遵循以下格式 name可以不传
      // [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
      fileList: []
    }
  },
  computed: {
    // 上传地址
    action() {
      // uploadSafe 必须上传服务器，不上传七牛
      const config = this.$store.state.config
      return config.auto_open && !this.uploadSafe ? config.upload_url : config.local_url
    },
    // 是否上传至七牛云
    isQiniu() {
      return this.$store.state.config.auto_open
    },
    // 文件类型
    fileType() {
      const fileType = {
        1: 'img', // 图片
        2: 'file', // 文档
        3: 'video', // 视频
        4: 'audio' // 音乐
      }
      return fileType[this.params.type]
    },
    // 额外参数 图片上传传参 r若为七牛云上传需要传参数
    data() {
      if (this.isQiniu) {
        var obj = { ...this.params, token: this.$store.state.config[this.fileType + 'Token'] || '' }
        obj['x:type'] = obj['type']
        delete obj['type']
        return obj
      } else return this.params
    },
    // 头部携带参数
    headers() {
      if (!this.isQiniu) return { Authorization: 'Bearer ' + getToken() }
      else return {}
    },
    // 组件使用允许上传的文件类型
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    accept() {
      const accept = {
        audio: 'audio/mp3,audio/mpeg',
        video: 'video/mp4',
        img: 'image/png, image/jpeg, image/jpg',
        file: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
      return accept[this.fileType]
    },
    // 校验使用允许上传的文件类型
    acceptList() {
      const acceptList = {
        audio: ['audio/mp3', 'audio/mpeg'],
        video: ['video/mp4'],
        img: ['image/png', 'image/jpeg', 'image/jpg'],
        file: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      }
      return acceptList[this.fileType]
    },
    // 信息提示
    messageType() {
      const messageType = {
        audio: '上传音乐只能是 mp3 或 mpeg 格式',
        video: '上传视频只能是 mp4 格式',
        img: '上传图片只能是 JPG 或 PNG 格式',
        file: '上传文件只能是 docx 格式'
      }
      return messageType[this.fileType]
    },
    messageSize() {
      const sizeStr = this.sizeLimit < 1024 ? this.sizeLimit + 'KB' : (this.sizeLimit / 1024) + 'MB'
      return '上传大小不能超过 ' + sizeStr
    },
    fileListId() {
      return this.fileList.map((item) => {
        return item.id
      })
    }
  },
  watch: {
    // 监听list改变动态修改fileList
    list(newV, oldV) {
      // 初始化数据,监听数据修改为空的情况下同步数据的问题
      if ((newV || newV.length !== 0) && (!oldV || oldV.length === 0) || !newV || newV.length === 0) this.initFileList(newV)
    },
    // 监听只展示一个
    fileList: {
      deep: true,
      handler: function(newV, oldV) {
        this.limitShowPic()
      }
    }
  },
  created() {
    if (this.isQiniu) this.$store.dispatch('config/GetQiniuToken', { file_type: this.fileType })
    // 初始化组件数据
    if (this.list) this.initFileList(this.list)
  },
  mounted() {
    this.limitShowPic()
  },
  methods: {
    initFileList(newV) {
      if (newV) {
        if (typeof newV === 'object') {
          if (Array.isArray(newV)) this.fileList = this.deepClone(newV)
          else this.fileList = [this.deepClone(newV)]
        } else {
          this.fileList = [{ url: this.list }]
        }
      } else this.fileList = []
    },
    // 重置组件
    init(file) {
      if (!file) file = {}
      this.fileList = []
    },
    // 删除文件的钩子
    handleRemove(file, fileList) {
      this.$emit('remove', file.response ? file.response.data : file, this.rParams)
      this.fileList = fileList
    },
    // 自动上传成功的钩子
    handleSuccess(response, file, fileList) {
      // 避免重复上传
      if (this.fileListId.includes(response.data.id)) {
        this.$message.error('请不要重复上传视频')
        fileList.splice(-1, 1)
        this.fileList = fileList
      } else {
        this.$emit('change', response.data, this.rParams)
        // 防止修改过于快页面动画奇怪
        setTimeout(() => {
          this.fileList = fileList
        }, 300)
      }
    },
    // 自动上传失败的回调
    handleError(err, file, fileList) {
      err = JSON.parse(JSON.stringify(err))
      // token 过期
      if (err.status === 401) {
        // 移除过期token
        this.$store.commit('config/SET_' + this.fileType.toLocaleUpperCase() + '_TOKEN', '')
        // 重新请求token
        this.$store.dispatch('config/GetQiniuToken', { file_type: this.fileType })
          .then(res => {
            // 重新上传
            this.req(file.raw, this.action)
          })
      } else {
        this.$message.error('请上传正确的格式')
      }
    },
    // 预览已上传点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      // 图片预览的钩子
      this.dialogVisible = true
      this.previewSrc = file.path || file.response.data.path || file.url
    },
    // 图片上传前的校验
    beforeUpload(file) {
      // 是否是允许类型
      const isAcceptType = this.acceptList.includes(file.type)
      // 是否小于指定大小
      const isLt = file.size / 1024 < this.sizeLimit
      if (!file.type || !isAcceptType) this.$message.error(this.messageType)
      if (!isLt) this.$message.error(this.messageSize)
      return isAcceptType && isLt
    },
    // 手动触发上传到服务器
    req(file, url) {
      const formData = new FormData()
      formData.append('file', file)
      for (var key in this.data) {
        formData.append(key, this.data[key])
      }
      request({
        baseURL: '',
        url,
        method: 'post',
        data: formData
      }).then(res => {
        this.$emit('change', res.data, this.rParams)
      }).catch(res => {
        this.init(file)
      })
    },
    // 文件个数限制提醒
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，已选择了 ${fileList.length} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件，已超出限制`)
    },
    // 限制展示单个图片
    limitShowPic() {
      if (this.drag || this.limit > 1 || this.fileType !== 'img') return
      const obj = document.querySelector(`#${this.uploadId} .el-upload--picture-card`)
      const condition = this.limit === 1 && this.fileList && this.fileList.length === 1
      obj.style.display = condition ? 'none' : 'inline-block'
    },
    // 如果图片需要添加水印则无法使用组件的自动上传，需要监听事件改变上传图片
    handleChange(file) {
      if (this.hasWatermark) {
        // 校验格式
        if (this.beforeUpload(file.raw)) {
          // 添加水印
          this.makeWatermarke(file)
            .then((imgurl) => {
              file = this.dataURLtoFile(imgurl, 'img' + new Date().getTime())
              // 上传
              this.req(file, this.action)
            })
        } else {
          // 校验失败重置组件
          this.init(file)
          return false
        }
      }
    },
    // 为图片添加水印
    makeWatermarke(file) {
      return new Promise((resolve, reject) => {
        Watermark.toWatermark(file.raw, (imgurl) => {
          this.fileList = [{ url: imgurl }]
          resolve(imgurl)
        }, {
          cwOption: { text: this.text },
          imgOption: { size: 1200 }
        })
      })
    },
    // 将URL转为图片
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
    }
  }
}
</script>

<style lang='scss' scoped>
.yulan {
  max-width: 100%;
  max-height: 70vh;
  display: block;
  margin: 0 auto;
}
</style>
