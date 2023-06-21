<template>
  <el-form ref="form" :rules="rulesForm" :model="form" :label-position="$store.state.app.labelPosition" label-width="251px">
    <tip title="负责人信息" />
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" placeholder="负责人姓名长度在 2 到 10 个字符" maxlength="10" />
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model="form.phone" maxlength="11" placeholder="负责人手机号码" />
    </el-form-item>
    <tip>
      <template><span>紧急联系人信息</span></template>
      <template #small><b>(选填)</b></template>
    </tip>
    <el-form-item label="姓名" prop="two_name">
      <el-input v-model="form.two_name" placeholder="紧急联系人姓名长度在 2 到 10 个字符" maxlength="10" />
    </el-form-item>
    <el-form-item label="电话" prop="two_phone">
      <el-input v-model="form.two_phone" maxlength="11" placeholder="紧急联系人手机号码" />
    </el-form-item>
  </el-form>
</template>
<script>
import { validatePhone } from '@/utils/validate'

export default {
  props: {
    form: {
      type: Object,
      default() {
        return {
          name: '',
          phone: '',
          two_name: '',
          two_phone: '',
          service_phone: ''
        }
      }
    }
  },
  data() {
    const validatPhoneNumber = (rule, value, callback) => {
      if (value && (!validatePhone(value))) {
        callback(
          new Error('请输入正确的手机号')
        )
      } else {
        callback()
      }
    }
    return {
      rulesForm: {
        name: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入负责人电话', trigger: 'blur' },
          { validator: validatPhoneNumber, trigger: 'blur' }
        ],
        two_name: [
          { required: false, min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        two_phone: [
          { validator: validatPhoneNumber, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    service_code: function() {
      return this.form.upload[this.form.service_code] || ''
    }
  },
  methods: {
    validateForm: function() {
      var result = false
      this.$refs['form'].validate(valid => {
        result = valid
      })
      return result
    },
    clearValidate: function() {
      this.$refs.form.clearValidate()
    }
  }
}
</script>
