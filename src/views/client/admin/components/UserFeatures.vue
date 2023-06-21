<template>
  <el-form ref="form" :model="form" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="251px">
    <el-form-item label="开通霸屏广告" prop="customer_video">
      <el-switch v-model="form.customer_video" />
    </el-form-item>

    <el-form-item label="是否创建全国活动" prop="is_national">
      <el-switch v-model="form.is_national" />
    </el-form-item>

    <el-form-item label="是否开启卡劵功能" prop="is_open_card">
      <el-switch v-model="form.is_open_card" />
      <div class="tip-font">注：开启卡劵功能后用户才能使用卡劵功能</div>
    </el-form-item>

    <template v-if="checkRole(['admin','operation']) && checkRole(['agent'],form.role_id)">

      <el-form-item label="是否开启吸粉功能" prop="is_open_authorization">
        <el-switch v-model="form.is_open_authorization" />
        <div class="tip-font">注：开启吸粉功能后,用户需要先去个人信息页面点击【公众号授权】按钮授权成功后，才能在活动中正常使用吸粉功能（授权后，不可更改）</div>
      </el-form-item>

      <template>
        <el-form-item label="个人中心是否开启小程序" prop="is_weapp">
          <el-switch key="is_weapp" v-model="form.is_weapp" />
        </el-form-item>
        <el-form-item v-if="form.is_weapp" label="小程序码" prop="weapp_image">
          <FileManager key="weappImage" :value="form.weapp_image" :type="12" :size="1024" @change="updateWeapp" />
        </el-form-item>
        <p v-show="form.is_weapp" style="margin-left:251px;" class="tip-font">* 建议上传50px*50px,大小不超过1M</p>
      </template>

      <template>
        <el-form-item label="自定义系统名称" prop="custom_name">
          <el-input v-model="form.custom_name" maxlength="10" placeholder="长度在 1 到 10 个字符" />
        </el-form-item>
        <el-form-item label="自定义系统logo" prop="custom_icon">
          <FileManager key="sysLogo" :value="form.custom_icon" :type="12" :size="1024" @change="updateIcon" />
        </el-form-item>
        <p style="margin-left:251px;" class="tip-font">* 建议上传logo150px*150px,大小不超过1M</p>
      </template>

    </template>

  </el-form>
</template>
<script>
import FileManager from '@/components/FileManager/index'

export default {
  components: { FileManager },
  props: {
    form: {
      type: Object,
      default() {
        return {
          customer_video: false, // 霸屏广告
          is_national: false, // 全国红包
          is_open_authorization: false, // 吸粉
          is_open_card: false, // 红包卡劵
          custom_name: '', // 自定义名称
          custom_icon: { path: '' }, // 自定义logo
          is_weapp: false, // 是否开启小程序
          weapp_image: { path: '' } // 小程序码
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
    // 更新小程序
    updateWeapp(val) {
      this.$emit('change', { key: 'weapp_image', val })
    },
    // 更新系统logo
    updateIcon(val) {
      this.$emit('change', { key: 'custom_icon', val })
    }
  }
}
</script>
