<template>
  <div class="app-container">
    <el-card class="po-relative">
      <div v-if="isEmpty">{{ listLoading?'数据加载中':"暂无资源" }}</div>
      <el-tabs v-else v-model="activeName">
        <el-tab-pane v-for="(list,channelId) in systemList" :key="channelId" :label="channelOption[channelId]" :name="'channel'+channelId">
          <div v-for="(item,key) in list" :key="key">
            <tip :title="item.title" />
            <div class="m-b">
              <!-- 正常input -->
              <el-input v-if="item.type === 1" :key="item.name" v-model="form[item.name]" :data-id="item.id" :data-name="item.name" auto-complete="off" @blur="blurForm" />
              <!-- 图片上传插件  -->
              <upload v-if="item.type === 2" :key="item.name" :list="form[item.name]" :params="{type:1}" :r-params="item" :drag="false" :has-watermark="false" @change="changeImage" @remove="RemoveImage" />
              <!-- textarea -->
              <el-input v-if="item.type === 3" :key="item.name" v-model="form[item.name]" :data-id="item.id" :data-name="item.name" type="textarea" auto-complete="off" :autosize="{ minRows: 2, maxRows: 10}" @blur="blurForm" />
              <!-- 富文本框editor -->
              <Tinymce v-if="item.type === 4" :key="item.name" :html="form[item.name]" :r-params="item" @change="blurEditor" />
              <!-- 开关 -->
              <el-switch v-if="item.type === 5" :key="item.name" v-model="form[item.name]" :data-name="item.name" :active-value="1" :inactive-value="0" @change="changeForm(item)" />
            </div>

          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Upload from '@/components/Upload/index'
import Tinymce from '@/components/Tinymce/index'

export default {
  name: 'Source',
  components: { Upload, Tinymce },
  data() {
    return {
      isEmpty: true,
      listLoading: true,
      activeName: '',
      channelOption: {},
      systemList: {},
      typeOption: { 1: 'input', 2: 'image', 3: 'textarea', 4: 'editor', 5: 'switch' },
      // 数据
      form: {}
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.isEmpty = true
      this.listLoading = true
      this.channelOption = {}
      this.systemList = {}
      this.getChannel()
        .then(() => {
          this.getSystem()
        })
    },
    // 分类列表
    getChannel() {
      return new Promise((reslove, reject) => {
        this.apiBtn('ChannelIndex')
          .then(response => {
            response.data.map(item => {
              this.channelOption[item.id] = item.title
            })
            reslove()
          }).catch(() => {
            reject()
          })
      })
    },
    getSystem() {
      this.apiBtn('SystemIndex')
        .then(response => {
          response.data.map((item, index) => {
            if (index === 0) this.activeName = 'channel' + item.channel
            if (!this.systemList[item.channel]) this.$set(this.systemList, item.channel, [])
            this.systemList[item.channel].push(item)
            this.$set(this.form, item.name, item.type === 2 ? [{ url: item.path }] : (item.detail || ''))
            this.isEmpty = false
          })

          this.listLoading = false
        })
    },
    // 更新表单
    updateForm(form) {
      this.apiBtn('SystemPatch', form)
        .then(res => {
          const obj = res.data
          if (obj.type === 2) this.form[obj.name][0] = obj.name
          else this.form[obj.name] = obj.detail
        })
    },
    // 修改input
    blurForm(res) {
      this.updateForm({
        id: res.srcElement.dataset.id,
        detail: this.form[res.srcElement.dataset.name]
      })
    },
    // 修改图片
    changeImage(res, params) {
      this.updateForm({
        id: params.id,
        images: res.id,
        path: res.path
      })
    },
    RemoveImage(res, params) {
      this.$message('请上传对应资源，否则删除无效')
    },
    // 修改富文本
    blurEditor(res, params) {
      // console.log(1, res, params)
      this.updateForm({
        id: params.id,
        detail: res
      })
    },
    changeForm(res) {
      this.updateForm({
        id: res.id,
        detail: this.form[res.name]
      })
    },
    config() {
      this.apiBtn('DeployCreateSetting')
        .then(res => {
          this.refresh()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.m-b {
  margin-bottom: 20px;
  display: block;
}
.po-relative {
  position: relative;
  .btn-setting {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 2;
  }
}
</style>
