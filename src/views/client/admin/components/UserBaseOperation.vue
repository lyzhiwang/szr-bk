<template>
  <el-form ref="form" :model="form" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="251px">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" maxlength="10" placeholder="姓名" />
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model="form.phone" maxlength="11" placeholder="电话" />
    </el-form-item>
    <el-form-item label="微信二维码" prop="service_code">
      <FileManager key="service_code" :value="form.service_code" :type="9" :size="1024" @change="changeCode" />
    </el-form-item>
  </el-form>
</template>
<script>
import FileManager from '@/components/FileManager/index'

export default {
  name: 'UserBaseOperation',
  components: { FileManager },
  props: {
    form: {
      type: Object,
      default() {
        return {
          name: '',
          phone: '',
          service_code: { path: '' } // 商家二维码
        }
      }
    }
  },
  data() {
    const validateFile = (rule, value, callback) => {
      if (value && value.id && value.path) callback()
      else callback(new Error('请上传微信二维码'))
    }

    return {
      formRules: {
        name: [{ required: true, trigger: 'change', message: '请设置客服名称' }],
        phone: [{ required: true, trigger: 'change', message: '请设置正确的客服电话' }],
        service_code: [{ required: true, trigger: 'change', validator: validateFile }]
      }
    }
  },
  mounted() {
    this.$store.dispatch('config/GetQiniuToken')
  },
  methods: {
    // 表单验证
    validateForm: function() {
      var result = false
      this.$refs['form'].validate(valid => {
        result = valid
      })
      return result
    },
    // 选择文件
    changeCode(val) {
      // 将图片路径同步到父组件
      this.$emit('change', { key: 'service_code', val })
      // 重新验证
      this.$refs['form'].validateField('service_code')
    }
  }
}
</script>
