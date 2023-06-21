<template>
  <el-dialog :visible.sync="currentVisible" :close-on-click-modal="false" :fullscreen="$store.state.app.device === 'mobile' ? true : false" title="霸屏广告" width="900px" center :before-close="toggleDialog">
    <el-form ref="exampleForm" :model="exampleForm" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="exampleForm.name" type="text" :rows="10" placeholder="请输入示例名称" />
      </el-form-item>
      <el-form-item label="图片" prop="path">
        <FileManager :value="exampleForm.path" :page-size="8" :type="12" :size="1000" @change="changePic" />
        <div class="tip-font">图片大小：687*1372</div>
      </el-form-item>
    </el-form>

    <template v-slot:footer>
      <el-button type="primary" @click="submit">{{ name }}</el-button>
      <el-button @click="toggleDialog()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import FileManager from '@/components/FileManager'

export default {
  components: { FileManager },
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
    const validatePic = (rule, val, callback) => {
      if (this.exampleForm.path && this.exampleForm.path.path && this.exampleForm.path.id) callback()
      else callback(new Error('请上传分享图片'))
    }
    return {
      currentVisible: false,
      exampleForm: {
        name: '',
        path: { path: '' }
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', message: '请填写名称' }],
        path: [{ required: true, trigger: 'change', validator: validatePic }]
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
        this.exampleForm = { ...newV }
      }
    }
  },
  mounted() {
    this.getQiniuToken()
  },
  methods: {
    submit() {
      this.$refs['exampleForm'].validate(valid => {
        if (valid) {
          const obj = { ...this.exampleForm }
          obj.path = obj.path.id
          this.apiBtn(this.exampleForm.id ? 'ExampleUpdate' : 'ExampleStore', obj)
            .then(res => {
              this.toggleDialog()
              this.$emit('success')
            })
        }
      })
    },
    toggleDialog() {
      this.$emit('close', '')
    },
    changePic(val) {
      this.exampleForm.path = { id: val.id, path: val.path }
    },
    // 获取七牛token
    getQiniuToken() {
      const token = this.$store.state.config.token
      if (!token || !token.audio) {
        this.$store.dispatch('config/GetQiniuToken', { other: true })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
