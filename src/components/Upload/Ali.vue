<template>
  <div class="ali">
    <!--  || isbtn -->
    <template v-if="limit > list.length">
      <div style="margin-bottom: 20px;">
        <el-button type="primary" size="small" @click="toggleDialog">从已有素材选择视频</el-button>
      </div>
    </template>

    <el-upload
      v-if="limit > list.length"
      :id="uploadId"
      ref="upload"
      :auto-upload="!hasWatermark"
      :file-list="fileList"
      :action="action"
      :accept="accept"
      :limit="limit"
      :multiple="multiple"
      :list-type="!drag && fileType === 'img' ? 'picture-card' : ''"
      :drag="drag"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-error="handleError"
      :http-request="ossUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :show-file-list="false"
    >
      <template>
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </template>

      <!-- <template v-else>
        <i v-if="fileType === 'img'" class="el-icon-plus" />
        <el-button v-else size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">{{ messageType }},且{{ messageSize }}</div>
      </template> -->

    </el-upload>

    <!-- v-if="list.length>0" -->
    <template v-if="list.length>0">
      <div class="video_list">
        <div v-for="(item,index) in list" :key="index" class="video_item" @click="openvideo(item)">
          <video :src="item.path" width="260" height="100">
            您的浏览器不支持 video 标签。
          </video>
          <div class="btn_list">
            <el-button type="primary" size="mini" @click="openvideo(item)">预览</el-button>
            <el-button type="danger" size="mini" @click.stop="deleteItem(item)">删除</el-button>
          </div>
        </div>
      </div>
    </template>

    <!-- 文件管理 -->
    <div v-show="isVisible" class="file-list">
      <div class="header">
        <span>文件管理</span>
        <i class="el-icon-close" @click="toggleDialog" />
      </div>

      <div class="content">

        <!-- 图片 -->
        <template v-if="allfileList && allfileList.length">
          <div v-for="(item, index) in allfileList" v-show="index < 8" :key="index" :class="['img-box', hover.index === index ? 'img-box-border' : '']" @dblclick="changeItem(item, index)" @touchend="changeItem(item, index)" @mouseover="mouserOver(item, index)" @mouseout="mouserOut(item, index)">
            <!-- <img :src="item.path"> -->
            <video :src="item.path" width="140" height="100">
              您的浏览器不支持 video 标签。
            </video>
            <div class="img-info ellipsis">
              <p :title="item.name" class="name ellipsis">{{ item.name }}</p>
              <p>
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
        <el-button size="mini" @click="nextPage">下一页</el-button>
        <el-button size="mini" @click="lastPage">上一页</el-button>
      </div>
    </div>

    <!-- 预览 -->
    <preview-dialog :is-visible="dialogVisible" :type="fileType" :src="previewSrc" @close="dialogVisible = false" />
  </div>
</template>

<script>
import OSS from 'ali-oss'
import PreviewDialog from '../Dialog/PreviewDialog.vue'
// import Watermark from '@/utils/watermark.js'
export default {
  name: 'UploadCompt',
  components: { PreviewDialog },
  props: {
    // 是否显示素材视频
    isbtn: {
      type: Boolean,
      default: true
    },
    // 多文件上传
    multiple: {
      type: Boolean,
      default: true
    },
    // 限制上传图片个数，默认为10
    limit: {
      type: Number,
      default: 1
    },
    // 请求携带参数 type
    params: {
      type: Object,
      default() {
        return { type: 3 }
      }
    },
    // 上传列表
    list: {
      type: [Array, Object, String],
      default() {}
    },
    // 上传大小限制 单位为 KB
    sizeLimit: {
      type: Number,
      default: 1024 * 20
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 返回参数
    rParams: {
      type: Object,
      default() {
        return {}
      }
    },
    // 是否使用个人的
    isSelf: {
      type: Boolean,
      default: false
    },
    // 是否添加水印
    hasWatermark: {
      type: Boolean,
      default: false
    },
    // 是否是拖拽上传
    drag: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number || String,
      default: 8
    }
  },

  data() {
    return {
      isVisible: false,
      allfileList: [],
      hover: { item: {}, index: -1 },
      total: 0,
      page: 1,

      fileList: [],
      fileListId: [],
      dialogVisible: false,
      previewSrc: '',
      uploadId: 'upload' + new Date().getTime()
    }
  },

  computed: {
    // // 获取阿里云需要的信息过期时间：1小时
    ossData() {
      // const oss = {
      //   // base: {
      //   //   accessKeyId: 'STS.NU787DKcppHzanMpLFvyfVcfS',
      //   //   accessKeySecret: 'AL5svEviG3tqKLvg64sKW5qTjMXAEUm1g3WwaX3YNoFJ',
      //   //   stsToken: 'CAIS9AF1q6Ft5B2yfSjIr5aCc43wprxRx4qRY0j8lEwTevZKuabNsTz2IH1FeHNhBO8dtvU\/n2BR7\/0dlqJIRoReREvCUcZr8sz6Vvpp7dKT1fau5Jko1beHewHKeTOZsebWZ+LmNqC\/Ht6md1HDkAJq3LL+bk\/Mdle5MJqP+\/UFB5ZtKWveVzddA8pMLQZPsdITMWCrVcygKRn3mGHdfiEK00he8TomtvjumJXAsEuC3AalkLUvyt6vcsT+Xa5FJ4xiVtq55utye5fa3TRYgxowr\/on0PYVpGic5oDNWAkIuk7ZKYjO+9hoNxRla7MmCwzBHkZDbx4SGoABiNF\/oJjfxZj6l6MQpB+JcobXpxp6hrGXUqnbQLSfiNj+1j5rbPgnMy8KtbvuhafV5KLehiCgszQhZmA6yR29czaosQnP0dN57KsHc4kogBzXuXaGs33R2zYH3yFWQ\/SJJs5fYsT9Fhnn+YN08ZGUI5xNA2RiuGLnSKBbQId60JM=',
      //   //   bucket: 'dou-kd',
      //   //   region: 'oss-cn-beijing'
      //   // },
      //   // callback: {
      //   //   callbackUrl: 'http:\/\/api.dou-kl.zwstk.cn\/api\/ali\/callback\/3',
      //   //   callbackBody: 'filepath=${object}&etag=${etag}&size=${size}&mimeType=${mimeType}&type=${x:type}&suffix=${x:suffix}&filename=${x:filename}',
      //   //   callbackBodyType: 'application\/x-www-form-urlencoded'
      //   // }
      // }
      const oss = this.$store.state.config.aliToken
      return oss
    },

    //
    action() {
      return 'oss-cn-beijing'
    },

    //
    headers() {
      return {
        'Content-Type': 'multipart/form-data'
      }
    },

    // 文件类型
    fileType() {
      return this.getFileName(this.params.type)
    },

    // 组件使用允许上传的文件类型
    accept() {
      const accept = {
        audio: 'audio/mp3,audio/mpeg',
        video: 'video/mp4',
        img: 'image/png, image/jpeg, image/jpg'
      }
      return accept[this.fileType]
    },

    // 校验使用允许上传的文件类型
    acceptList() {
      const acceptList = {
        audio: ['audio/mp3', 'audio/mpeg'],
        video: ['video/mp4'],
        img: ['image/png', 'image/jpeg', 'image/jpg']
      }
      return acceptList[this.fileType]
    },

    // 信息提示
    messageType() {
      const messageType = {
        audio: '上传音乐只能是 mp3 或 mpeg 格式',
        video: '上传视频只能是 mp4 格式,建议上传1080p',
        img: '上传图片只能是 JPG 或 PNG 格式'
      }
      return messageType[this.fileType]
    },

    //
    messageSize() {
      const sizeStr = this.sizeLimit < 1024 ? this.sizeLimit + 'KB' : this.sizeLimit / 1024 + 'MB'
      return '上传大小不能超过 ' + sizeStr
    },

    // 用于查看重复
    value_id: function() {
      var list = []
      for (const item of this.list) {
        list.push(item.id)
      }
      return list
    }
  },

  watch: {
    // 监听list改变动态修改fileList
    list(newV, oldV) {
      // 初始化数据,监听数据修改为空的情况下同步数据的问题
      if (((newV || newV.length !== 0) && (!oldV || oldV.length === 0)) || !newV || newV.length === 0) this.initFileList(newV)
    },
    // 监听只展示一个
    fileList: {
      deep: true,
      handler(newV, oldV) {
        this.limitShowPic()
      }
    },
    isVisible: function(val) {
      if (val) {
        this.getList()
      }
    },
    page: function() {
      this.getList()
    }
  },

  created() {
    // 获取的alitoken
    const config = this.$store.state.config
    if (!config.aliToken) {
      this.$store.dispatch('config/GetAliToken')
    }
  },

  mounted() {
    this.limitShowPic()
  },

  methods: {
    // 获取列表
    getList() {
      this.apiBtn('UploadIndex', { page: this.page, type: this.params.type, size: this.pageSize })
        .then(res => {
          this.allfileList = res.data
          this.total = res.meta.total
        })
    },
    // 上一页
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

    // 下一页
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

    // 每次打开初始化数据
    toggleDialog() {
      if (!this.disabled) {
        this.isVisible = !this.isVisible
        if (this.isVisible) {
          this.page = 1
        }
      }
    },

    // hover浮动
    mouserOver(item, index) {
      this.hover = { item: item, index: index }
    },

    // hover浮动移除
    mouserOut(item, index) {
      this.hover = { item: {}, index: -1 }
    },

    // 文件选择框删除
    deleteItem(item) {
      this.$emit('delete', item)
    },

    //
    changeItem(item, index) {
      if (this.value_id.indexOf(item.id) >= 0) {
        this.$message('请勿重复选择')
        return
      }
      this.$emit('change', item)
      if (item && item.id && item.path && item.name) this.toggleDialog()
    },

    // 初始化文件列表
    initFileList(newV) {
      if (newV) {
        if (typeof newV === 'object') {
          if (Array.isArray(newV)) this.fileList = this.deepClone(newV)
          else this.fileList = [this.deepClone(newV)]
        } else {
          this.fileList = [{ url: this.list }]
        }
      } else this.fileList = []

      this.fileList.map(item => {
        if (!item.url && item.path) item.url = item.path
      })
      this.fileListId = this.fileList.map(item => {
        return item.id
      })
    },

    // 文件个数限制提醒
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，已选择了 ${fileList.length} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件，已超出限制`)
    },

    // 上传前的回调
    beforeUpload(file) {
      // console.log('上传前的回调')
      // console.log(file)
      // 是否是允许类型
      const isAcceptType = this.acceptList.includes(file.type)
      // 是否小于指定大小
      const isLt = file.size / 1024 < this.sizeLimit
      if (!file.type || !isAcceptType) this.$message.error(this.messageType)
      if (!isLt) this.$message.error(this.messageSize)
      return isAcceptType && isLt
    },

    // 上传成功回调
    handleSuccess(response, file, fileList) {
      // 避免重复上传
      if (this.fileListId.includes(response.data.id)) {
        this.$message.error('请不要重复上传视频')
        let i = 0
        while (i < fileList.length) {
          if (fileList[i].raw.uid === file.uid) {
            fileList.splice(i, 1)
            break
          }
          i++
        }
      } else {
        this.$emit('change', response.data, this.rParams)
        this.fileListId.push(response.data.id)
        // 防止修改过于快页面动画奇怪
        setTimeout(() => {
          this.fileList = fileList
        }, 300)
      }
    },

    // 上传失败回调
    handleError(err, file, fileList) {
      this.$Message.error(err)
    },

    // 分片上传
    ossUpload(e) {
      // const client = new OSS({
      //   // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      //   region: 'oss-cn-beijing',
      //   // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      //   accessKeyId: ossData.Credentials.accessKeyId,
      //   accessKeySecret: ossData.Credentials.accessKeySecret,
      //   // 从STS服务获取的安全令牌（SecurityToken）。
      //   stsToken: ossData.Credentials.stsToken,
      //   // 填写Bucket名称，例如examplebucket。
      //   bucket: 'dou-kd'
      // })
      // console.log('分片上传')
      // console.log(e)
      const { file, onProgress, onSuccess, onError } = e
      const client = new OSS(this.ossData.base)
      const that = this
      // console.log('aaaaaaaaaaaaaaaaa')
      // console.log(this.ossData.base)
      // console.log(client)
      // let tempCheckpoint
      // const resdata = `${that.fileType}/${that.params.type}/${that.parseTime(new Date(), '{y}-{m}-{d}')}/${that.getRandomName(file.name)}`
      // console.log(resdata, 'resdata')
      // console.log(this.ossData, 'ossData')

      // 定义上传方法。
      async function multipartUpload() {
        try {
          // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
          // 您可以通过自定义文件名（例如exampleobject.txt）或目录（例如exampledir/exampleobject.txt）的形式，实现将文件上传到当前Bucket或Bucket中的指定目录。

          const { res, data } = await client.multipartUpload(`${that.fileType}/${that.params.type}/${that.parseTime(new Date(), '{y}-{m}-{d}')}/${that.getRandomName(file.name)}`, file, {
            progress(p, checkpoint) {
              onProgress({ percent: p * 100 })
              // checkpoint参数用于记录上传进度，断点续传上传时将记录的checkpoint参数传入即可。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
              // tempCheckpoint = checkpoint
            },
            parallel: 4,
            // 设置分片大小。默认值为1 MB，最小值为100 KB。
            partSize: 1024 * 1024,
            meta: { year: 2020, people: 'test' },
            mime: file.type,
            callback: {
              url: that.ossData.callback.callbackUrl,
              // host: 'oss-cn-beijing.aliyuncs.com',
              /* eslint no-template-curly-in-string: [0] */
              body: that.ossData.callback.callbackBody,
              contentType: that.ossData.callback.callbackBodyType,
              customValue: {
                filename: file.name,
                type: String(that.params.type),
                suffix: that.getSuffix(file.name)
              }
            }
          })
          if (res.status === 200 && data.code === 0) {
            onSuccess(data, file, that.fileList)
          } else {
            onError('文件上传失败，服务器端无响应', file, that.fileList)
          }
        } catch (err) {
          console.log(err)
          onError('文件上传失败，请求封装失败', file, that.fileList)
        }
      }

      // 开始分片上传。
      multipartUpload()
    },

    // 获取文件后缀
    getSuffix(name) {
      const arr = name.split('.')
      return '.' + arr[arr.length - 1]
    },

    // 获取随机名称
    getRandomName(name) {
      return this.randomString(20) + this.getSuffix(name)
    },

    // 预览已上传点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      // 图片预览的钩子
      this.dialogVisible = true
      this.previewSrc = file.path || file.response.data.path || file.url
    },

    // 预览
    openvideo(item) {
      // console.log(item)
      this.dialogVisible = true
      this.previewSrc = item.path
    },

    // 删除文件的钩子
    handleRemove(file, fileList) {
      this.$emit('remove', file.response ? file.response.data : file, this.rParams)
      this.fileList = fileList
    },

    // 限制展示单个图片
    limitShowPic() {
      if (this.drag || this.limit > 1 || this.fileType !== 'img') return
      const obj = document.querySelector(`#${this.uploadId} .el-upload--picture-card`)
      const condition = this.limit === 1 && this.fileList && this.fileList.length === 1
      obj.style.display = condition ? 'none' : 'inline-block'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.ali{
  position: relative;
}
.video_list{
  // border: 1px solid red;
  display: flex;
  flex-wrap: wrap;
  .video_item{
    // border: 1px solid blue;
    padding: 0;
    margin: 0;
    margin-bottom: 10px;
    cursor: pointer;
    .btn_list{
      display: flex;
      justify-content:center;
    }
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
          margin-left: 10px;
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
</style>
