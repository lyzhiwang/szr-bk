<template>
  <el-form ref="form" :rules="rulesForm" :model="form" :label-position="$store.state.app.labelPosition" label-width="251px">
    <tip title="开户方信息" />
    <!-- 开户方性质 1:企业 2：个人 3：门店 -->
    <el-form-item label="性质" prop="nature">
      <el-radio-group v-model="form.nature" :disabled="isUpdate">
        <el-radio :label="1">企业</el-radio>
        <el-radio :label="3">门店</el-radio>
        <el-radio :label="2">个人</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="form.nature!==2" label="营业执照" prop="license">
      <FileManager key="license" :value="form.license" :type="6" :size="1024" @change="updateLicense" />
    </el-form-item>
    <el-form-item v-if="form.nature!==3" label="身份证正面" prop="idcard_a">
      <FileManager key="idcard_a" :value="form.idcard_a" :type="6" :size="1024" @change="updateIdcard_a" />
    </el-form-item>
    <el-form-item v-if="form.nature!==3" label="身份证反面" prop="idcard_b">
      <FileManager key="idcard_b" :value="form.idcard_b" :type="6" :size="1024" @change="updateIdcard_b" />
    </el-form-item>
    <!-- <el-form-item label="地址" prop="address">
      <el-input v-model="form.address" maxlength="50" placeholder="长度在 1 到 50 个字符" />
    </el-form-item> -->
  </el-form>
</template>
<script>
import FileManager from '@/components/FileManager/index'

export default {
  components: {
    FileManager
  },
  props: {
    form: {
      type: Object,
      default() {
        return {
          nature: 1,
          license: { path: '' },
          idcard_a: 0,
          idcard_b: 0,
          address: '',
          upload: {}
        }
      }
    },
    isUpdate: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const validateReq = (rule, value, callback) => {
      if (!value) {
        callback(new Error(rule))
      } else {
        callback()
      }
    }

    const validateFile = (rule, value, callback) => {
      if (value && value.id && value.path) callback()
      else callback(new Error('请上传图片'))
    }
    return {
      rulesForm: {
        nature: [
          { required: true, validator: validateReq, message: '请选择开户方性质', trigger: 'change' }
        ],
        license: [
          { required: true, validator: validateFile, message: '请上传营业执照', trigger: 'blur' }
        ],
        idcard_a: [
          { required: true, validator: validateFile, message: '请上传身份证正面', trigger: 'blur' }
        ],
        idcard_b: [
          { required: true, validator: validateFile, message: '请上传身份证反面', trigger: 'blur' }
        ]
        // address: [
        //   { required: true, message: '请填写开户方地址', trigger: 'blur' },
        //   { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        // ]
      }
    }
  },
  computed: {
    // 为图片上传控件添加值
    license: function() {
      return this.form.upload[this.form.license] || ''
    },
    idcard_a: function() {
      return this.form.upload[this.form.idcard_a] || ''
    },
    idcard_b: function() {
      return this.form.upload[this.form.idcard_b] || ''
    }
  },
  methods: {
    updateLicense(obj) {
      this.changePic('license', obj)
    },
    updateIdcard_a(obj) {
      this.changePic('idcard_a', obj)
    },
    updateIdcard_b(obj) {
      this.changePic('idcard_b', obj)
    },
    changePic(key, obj) {
      // 将图片路径同步到父组件
      this.$emit('change', key, obj)
      // 重新验证
      this.$refs['form'].validateField(key)
    },
    // 表单验证方法 父组件调用
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
