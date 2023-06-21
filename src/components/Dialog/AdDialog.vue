<template>
  <el-dialog :visible.sync="currentVisible" :close-on-click-modal="false" :fullscreen="$store.state.app.device === 'mobile' ? true : false" title="霸屏广告" width="900px" center :before-close="toggleDialog">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-form ref="adForm" :model="adForm" :rules="formRules" label-width="100px">
          <el-form-item label="广告名称" prop="link_name">
            <el-input v-model="adForm.link_name" type="text" :rows="3" placeholder="请输入广告名称" />
          </el-form-item>
          <el-form-item label="抖音" prop="path">
            <el-input v-model="adForm.path[0]" type="textarea" :rows="3" placeholder="请粘贴广告链接" />
          </el-form-item>
          <el-form-item label="快手" prop="path">
            <el-input v-model="adForm.path[1]" type="textarea" :rows="3" placeholder="请粘贴广告链接" />
          </el-form-item>
          <el-form-item label="微视" prop="path">
            <el-input v-model="adForm.path[2]" type="textarea" :rows="3" placeholder="请粘贴广告链接" />
          </el-form-item>
          <el-form-item label="淘宝" prop="path">
            <el-input v-model="adForm.path[3]" type="textarea" :rows="3" placeholder="请粘贴广告链接" />
          </el-form-item>
          <div class="tip-font">注：如填写多条广告链接，用户参与活动后，第一个打开哪个平台，推送哪个平台的霸屏广告，其他平台不再推送。</div>
        </el-form>
      </el-col>
      <el-col :span="8">
        <div class="block">
          <el-carousel height="440px">
            <el-carousel-item v-for="item in exampleList" :key="'img'+item.id">
              <h4 class="small">效果预览--{{ item.name }}</h4>
              <img class="imgType" :src="item.path.path" alt="" srcset="">
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
    </el-row>

    <template v-slot:footer>
      <el-button type="primary" @click="submit">{{ name }}</el-button>
      <el-button @click="toggleDialog()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>

export default {
  props: {
    form: {
      type: Object,
      default() {}
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validatePath = (rule, val, callback) => {
      let v = ''
      if (!val) callback(new Error('请填写至少一种广告地址'))
      val.map(item => { v = item + v })
      if (!v) callback(new Error('请填写至少一种广告地址'))
      else callback()
    }
    return {
      currentVisible: false,
      formRules: {
        path: [{ required: true, trigger: 'blur', validator: validatePath }],
        link_name: [{ required: true, trigger: 'blur', message: '请填写广告名称' }]
      },
      exampleList: [],
      adForm: {
        link_name: '',
        path: ['', '', '', '']
      }
    }
  },
  computed: {
    // 1 新增 2修改
    type() {
      return this.form.id ? 2 : 1
    },
    name() {
      return this.form.id ? '修改' : '新增'
    }
  },
  watch: {
    isVisible(val) {
      this.currentVisible = val
    },
    form: {
      deep: true,
      handler(newV, oldV) {
        this.adForm = { ...newV, path: [...newV.path] }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.apiBtn('ExampleIndex', { page: 1, size: 1000 }).then(res => {
        this.exampleList = res.data.list
      })
    },
    submit() {
      this.$refs['adForm'].validate(valid => {
        if (valid) {
          this.apiBtn(this.form.id ? 'AdUpdate' : 'AdStore', { ...this.adForm })
            .then(res => {
              this.toggleDialog()
              this.$emit('success', this.form.link)
            })
        }
      })
    },
    toggleDialog() {
      this.$refs.adForm.clearValidate()
      this.$emit('close', '')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.block{
  text-align: center;
}
.imgType{
  width: auto;
  height: 400px;
}
.tip-font{
  margin-left: 100px;
  line-height: 20px;
}
</style>
