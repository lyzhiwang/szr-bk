<template>
  <div class="detail">
    <el-form ref="form" :model="form" :rules="formRules" label-position="right" label-width="150px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>

      <el-form-item label="logo" prop="logo">
        <FilesManager key="set-logo" :value="form.logo" :page-size="8" :type="9" :size="1024" @change="changelogo" />
      </el-form-item>

      <el-form-item label="qrcode" prop="qrcode">
        <FilesManager key="set-qrcode" :value="form.qrcode" :page-size="8" :type="3" :size="1024" @change="changeqrcode" />
      </el-form-item>

      <!-- <el-form-item label="商家提现手续费(%)">
        <el-input-number v-model="form.cash_service" placeholder="请输入商家提现手续费" maxlength="10" :controls="false" clearable :precision="2" />
      </el-form-item> -->
      <!-- <el-form-item label="服务商手续费(%)" prop="agent_cash_service">
        <el-input-number v-model="form.agent_cash_service" placeholder="请输入服务商手续费" maxlength="10" :controls="false" clearable :precision="2" />
      </el-form-item> -->
      <!-- <el-form-item label="达人手续费(%)" prop="talent_cash_service">
        <el-input-number v-model="form.talent_cash_service" placeholder="请输入达人手续费" maxlength="10" :controls="false" clearable :precision="2" />
      </el-form-item> -->

      <!-- <el-form-item label="充值手续费(%)" prop="charge_service">
        <el-input-number v-model="form.charge_service" placeholder="请输入充值手续费" maxlength="10" :controls="false" clearable :precision="2" />
      </el-form-item> -->

      <!-- <el-form-item label="霸屏" prop="ad">
        <el-input v-model="form.ad" type="textarea" style="width:600px;" />
      </el-form-item>
      <div class="tip-font" style="margin-left: 150px;">
        注：如填写多条广告链接，用户参与活动后，第一个打开哪个平台，推送哪个平台的霸屏广告，其他平台不再推送。
      </div> -->

      <!-- <el-form-item label="审核开关" prop="audit_mode">
        <el-radio-group v-model="form.audit_mode">
          <el-radio :label="0">关闭</el-radio>
          <el-radio :label="1">开启</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <div class="submit_btn">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { validatePhone } from '@/utils/validate'
import FilesManager from '@/components/FileManager/index.vue'
export default {
  name: 'Basics',
  components: { FilesManager },
  data() {
    // const validatPhoneNumber = (rule, value, callback) => {
    //   if (value && (!validatePhone(value))) {
    //     callback(
    //       new Error('请输入正确的手机号')
    //     )
    //   } else {
    //     callback()
    //   }
    // },
    const validateLogo = (rule, val, callback) => {
      if (this.form.logo === '' || this.form.logo.id === '') {
        callback(new Error('请设置logo'))
      } else callback()
    }
    const validateqrcode = (rule, val, callback) => {
      if (this.form.qrcode === '' || this.form.qrcode.id === '') {
        callback(new Error('请设置logo'))
      } else callback()
    }

    return {

      iscreate: true, // 是否是创建
      form: {
        id: '',
        name: '', // 名称
        phone: '', // 联系电话
        logo: { // logo
          id: '',
          path: ''
        },
        qrcode: { // 二维码
          id: '',
          path: ''
        }
        // cash_service: 0, // 商家提现手续费
        // agent_cash_service: '', // 服务商手续费
        // talent_cash_service: '', // 达人手续费
        // charge_service: 0 // 充值手续费
        // ad: '' // 霸屏广告
        // audit_mode: 0 // 是否审核
      },
      formRules: {
        name: [{ required: true, trigger: 'change', message: '请输入名称' }],
        phone: [{ required: true, trigger: 'change', message: '联系方式不能为空' }],
        logo: [{ required: true, trigger: 'change', validator: validateLogo }],
        qrcode: [{ required: true, trigger: 'change', validator: validateqrcode }]
        // phone: [
        //   { required: true, message: '请输入联系电话', trigger: 'blur' },
        //   { validator: validatPhoneNumber, trigger: 'blur' }
        // ],
        // cash_service: [{ required: true, trigger: 'change', message: '提现手续费不能为空' }],
        // charge_service: [{ required: true, trigger: 'change', message: '充值手续费不能为空' }],
        // logo_screen: [{ required: true, trigger: 'change', validator: validateLogo }]
        // qrcode
        // audit_mode: [{ required: true, trigger: 'change', message: '是否开启审核' }]
      }
    }
  },
  computed: {
    ...mapState({
      userid: state => state.user.userId
    })
  },
  created() {
    this.getDetail()
  },
  mounted() {},
  methods: {

    // logo
    changelogo(val) {
      var obj = {}
      obj.id = val.id
      obj.path = val.path
      this.form.logo = obj
    },

    // qrcode
    changeqrcode(val) {
      var obj = {}
      obj.id = val.id
      obj.path = val.path
      this.form.qrcode = obj
    },

    // 获取设置详情
    getDetail() {
      this.apiBtn('SettingsShow', { id: this.userid }).then((res) => {
        if (res.data.length !== 0) {
          this.iscreate = false
          this.form = res.data
          if (!res.data.logo || !res.data.logo.id) {
            this.form.logo = {
              id: '',
              path: ''
            }
          }
          if (!res.data.qrcode || !res.data.qrcode.id) {
            this.form.qrcode = {
              id: '',
              path: ''
            }
          }
        }
      })
    },

    // 提交
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.apiBtn(this.iscreate ? 'SettingsStore' : 'SettingsUpdate', this.formateData({ ...this.form })).then(res => {
            console.log(res)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 提交数据校验
    formateData(form) {
      form.id = this.userid
      form.logo = form.logo.id
      form.qrcode = form.qrcode.id
      //   this.deleteData(['fixed'], form)
      return form
    },

    // 便利删除对象
    deleteData(delData, data) {
      // 便利删除对象
      for (const key in data) {
        if (delData.includes(key) && data[key] !== undefined) delete data[key]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail{
  padding-top: 30px;
}
.submit_btn{
  margin-left: 150px;
  margin-bottom: 40px;
}
</style>
