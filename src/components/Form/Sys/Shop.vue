<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="251px">

      <tip>商家信息<template #small>(创建活动会展示商家信息)</template></tip>

      <template>
        <el-form-item label="商家名称" prop="shop_name" class="activity-shop_name">
          <el-input v-model="form.shop_name" :disabled="disabled" maxlength="13" show-word-limit clearable />
        </el-form-item>
      </template>

      <template>
        <el-form-item label="商家定位" prop="location" class="activity-location">
          <el-input :value="form.location?'已获取商家定位':'请点击定位按钮选择商家定位'" :disabled="true" clearable placeholder="请点击定位按钮选择商家定位" />
          <el-button :disabled="disabled" type="primary" @click="dialogVisible = true">定位</el-button>
        </el-form-item>
      </template>

      <template>
        <el-form-item label="商家地址" prop="address" class="activity-address">
          <el-input v-model="form.address" :disabled="disabled" type="textarea" :rows="2" maxlength="50" show-word-limit clearable placeholder="请填写商家地址" />
        </el-form-item>
      </template>

      <template>
        <el-form-item label="商家电话" prop="service_phone" class="activity-service_phone">
          <el-input v-model="form.service_phone" :disabled="disabled" maxlength="20" placeholder="商家电话" clearable />
        </el-form-item>
      </template>

      <template>
        <el-form-item label="商家二维码" prop="service_code" class="activity-service_code">
          <FileManager :value="form.service_code" :page-size="8" :disabled="disabled" :type="3" :size="100" @change="changeCode" />
        </el-form-item>
        <div class="tip-font">1.图片尺寸比例为1：1；2.图片大小必须小于100KB</div>
      </template>
    </el-form>

    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="$store.state.app.device === 'mobile' ? true : false"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="7vh"
      title="商家位置"
      width="80%"
    >
      <Map :form="form" @hide="dialogVisible=false" @change="updateForm" />
    </el-dialog>
  </div>
</template>

<script>
import Map from '@/components/Tool/Map'
import FileManager from '@/components/FileManager/index'

export default {
  components: { FileManager, Map },
  props: {
    form: {
      type: Object,
      default() {
        return {
          shop_name: '', // 商家名称
          address: '', // 商家位置
          location: '', // 商家坐标
          service_code: { path: '' }, // 商家二维码
          service_phone: '' // 商家客服电话
        }
      }
    }
  },
  data() {
    const validateFile = (rule, value, callback) => {
      if (value && value.id && value.path) callback()
      else callback(new Error('请上传公众号二维码'))
    }

    return {
      disabled: false,
      name: '',
      dialogVisible: false,
      areaList: [],
      formRules: {
        shop_name: [{ required: true, trigger: 'change', message: '请设置正确的商家名称' }],
        address: [{ required: true, trigger: 'change', message: '请设置正确的商家地址' }],
        location: [{ required: true, trigger: 'change', message: '请设置正确的商家定位' }],
        service_code: [{ required: true, trigger: 'change', validator: validateFile }],
        service_phone: [{ required: true, trigger: 'change', message: '请设置正确的商家电话' }]
      },
      areaProps: {
        value: 'id',
        label: 'name',
        multiple: true,
        expandTrigger: 'hover'
      }
    }
  },
  watch: {
    dialogVisible(newV, oldV) {
      if (newV === false) this.$refs.form.validateField('address')
    }
  },
  mounted() {
    this.getQiniuToken()
  },
  methods: {
    // 更新表单
    updateForm(key, val) {
      this.$emit('change', key, val)
    },
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
      this.updateForm('service_code', val)
      // 重新验证
      this.$refs['form'].validateField('service_code')
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
.el-form {
  z-index: 1000;
  .cascader-wrapper {
    width: 300px;
  }
}
.el-dialog__body{
  padding-top: 0;
}
.tip-font{
  margin-left: 251px;
}
@media screen and (max-width: 1000px) {
    .tip-font{
      margin-left: 0;
    }
}
</style>
