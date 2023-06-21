<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div>
          <span>OEM代理商：{{ $route.query.id }}</span>
        </div>
      </template>
      <!--  :rules="rulesForm" -->
      <el-form ref="form" :model="setting" label-width="200px">
        <tip title="基本信息配置" />
        <el-form-item label="域名（domain）" prop="domain">
          <el-input v-model="setting.domain" maxlength="32" />
        </el-form-item>
        <el-form-item label="分享域名（share_domain）" prop="share_domain">
          <el-input v-model="setting.share_domain" maxlength="32" />
        </el-form-item>
        <el-form-item label="提现手续费" prop="service_charge">
          <el-input v-model="setting.service_charge" maxlength="32" />
        </el-form-item>
        <el-form-item label="是否是我们的子商户">
          <el-switch
            v-model="setting.pay_type"
            :active-value="1"
            :inactive-value="2"
          />
        </el-form-item>
        <el-form-item label="是否开通企业付款到零钱">
          <el-switch
            v-model="setting.can_pay"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>

        <tip title="公众号配置" />
        <el-form-item label="appid" prop="appid">
          <el-input v-model="setting.appid" maxlength="32" />
        </el-form-item>
        <el-form-item label="appsecret" prop="appsecret">
          <el-input v-model="setting.appsecret" maxlength="32" />
        </el-form-item>
        <!-- <el-form-item label="token" prop="token">
          <el-input v-model="setting.token" maxlength="32" />
        </el-form-item>
        <el-form-item label="encodingaeskey" prop="encodingaeskey">
          <el-input v-model="setting.encodingaeskey" />
        </el-form-item> -->

        <tip title="微信支付配置" />
        <el-form-item label="mch_id" prop="mch_id">
          <el-input v-model="setting.mch_id" maxlength="32" />
        </el-form-item>
        <el-form-item label="商户密钥" prop="partnerkey">
          <el-input v-model="setting.partnerkey" maxlength="32" />
        </el-form-item>
        <el-form-item label="证书内容" prop="apiclient_cert">
          <el-input
            v-model="setting.apiclient_cert"
            type="textarea"
            :rows="3"
            style="width:50%;"
            @focus="focusApiclient('cert')"
            @blur="blurApiclient('cert')"
          />
        </el-form-item>
        <div class="tip-font">请复制文件(apiclient_cert.pem)内容到此处</div>
        <el-form-item label="证书密钥" prop="apiclient_key">
          <el-input
            v-model="setting.apiclient_key"
            type="textarea"
            :rows="3"
            style="width:50%;"
            @focus="focusApiclient('key')"
            @blur="blurApiclient('key')"
          />
        </el-form-item>
        <div class="tip-font">请复制文件(apiclient_key.pem)内容到此处</div>
        <el-form-item label="默认支付结果通知地址" prop="notify_url">
          <el-input v-model="setting.notify_url" />
        </el-form-item>
        <tip title="小程序配置" />
        <el-form-item label="appid" prop="mini_appid">
          <el-input v-model="setting.mini_appid" maxlength="50" />
        </el-form-item>
        <el-form-item label="appsecret" prop="mini_appsecret">
          <el-input v-model="setting.mini_appsecret" maxlength="32" />
        </el-form-item>

        <!-- <tip title="微信模板消息" />
        <el-form-item label="微信模板消息id" prop="template_id">
          <el-input v-model="setting.template_id" maxlength="32" />
        </el-form-item>
        <tip title="阿里云" />
        <el-form-item label="key" prop="ali_key">
          <el-input v-model="setting.ali_key" maxlength="50" />
        </el-form-item>
        <el-form-item label="secret" prop="ali_secret">
          <el-input v-model="setting.ali_secret" maxlength="32" />
        </el-form-item>
        <el-form-item label="sign_name" prop="ali_sign_name">
          <el-input v-model="setting.ali_sign_name" maxlength="32" />
        </el-form-item>
        <el-form-item label="templat_code" prop="ali_templat_code">
          <el-input v-model="setting.ali_templat_code" maxlength="32" />
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" @click="SubmitForm('form')">提交</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>

export default {
  data() {
    return {
      id: '$route.query.id',
      temp_cert: '',
      temp_key: '',
      setting: {
        appid: '',
        appsecret: '',
        token: '',
        encodingaeskey: '',
        mch_id: '',
        partnerkey: '',
        apiclient_cert: '',
        apiclient_key: '',
        notify_url: '',
        mini_appid: '',
        mini_appsecret: '',
        domain: '',
        share_domain: '',
        template_id: '',
        service_charge: '',
        pay_type: 2,
        can_pay: 0,
        ali_key: '',
        ali_secret: '',
        ali_sign_name: '',
        ali_templat_code: ''
      }
      // rulesForm: {
      //   appid: [{ required: true, message: '公众号appid不能为空', trigger: 'blur' }],
      //   appsecret: [{ required: true, message: '公众号appsecret不能为空', trigger: 'blur' }],
      //   token: [{ required: true, message: '公众号token不能为空', trigger: 'blur' }],
      //   encodingaeskey: [{ required: true, message: '公众号encodingaeskey不能为空', trigger: 'blur' }],
      //   mch_id: [{ required: true, message: '商户号不为空', trigger: 'blur' }],
      //   partnerkey: [{ required: true, message: '商户密钥不为空', trigger: 'blur' }]
      // }
    }
  },
  created() {
    this.apiBtn('AgentConfigShow', { id: this.$route.query.id }).then(res => {
      this.initForm(res.data)
    })
  },
  methods: {
    SubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.apiBtn('AgentConfigUpdate', this.formateForm()).then(res => {
            if (res.code === 0) {
              this.$message({
                message: '配置成功',
                type: 'success'
              })
            }
          })
        }
      })
    },
    // 展示证书内容
    focusApiclient(value) {
      if (value === 'cert') {
        this.setting.apiclient_cert = this.temp_cert
      } else {
        this.setting.apiclient_key = this.temp_key
      }
    },
    // 隐藏证书内容
    blurApiclient(value) {
      if (value === 'cert') {
        this.temp_cert = this.setting.apiclient_cert
        this.setting.apiclient_cert = '*'
      } else {
        this.temp_key = this.setting.apiclient_key
        this.setting.apiclient_key = '*'
      }
    },
    initForm(data) {
      if (data.official_account) {
        this.setting.appid = data.official_account.app_id || ''
        this.setting.appsecret = data.official_account.secret || ''
        this.setting.token = data.official_account.token || ''
        this.setting.encodingaeskey = data.official_account.aes_key || ''
      }

      if (data.payment) {
        this.setting.mch_id = data.payment.mch_id || ''
        this.setting.partnerkey = data.payment.key || ''
        this.setting.apiclient_cert = '*' || ''
        this.setting.apiclient_key = '*' || ''
        this.setting.notify_url = data.payment.notify_url || ''

        this.temp_cert = data.payment.cert_path || ''
        this.temp_key = data.payment.key_path || ''
      }

      if (data.mini_program) {
        this.setting.mini_appid = data.mini_program.app_id || ''
        this.setting.mini_appsecret = data.mini_program.secret || ''
      }

      if (data.aliyun) {
        this.setting.ali_key = data.aliyun.key || ''
        this.setting.ali_secret = data.aliyun.secret || ''
        this.setting.ali_sign_name = data.aliyun.sign_name || ''
        this.setting.ali_templat_code = data.aliyun.templat_code || ''
      }

      this.setting.domain = data.domain || ''
      this.setting.can_pay = data.can_pay || ''
      this.setting.share_domain = data.share_domain || ''
      this.setting.template_id = data.template_id || ''
      this.setting.service_charge = data.service_charge || ''
      this.setting.pay_type = data.pay_type || 2
    },
    formateForm() {
      return {
        id: this.$route.query.id,
        official_account: {
          app_id: this.setting.appid, // AppID
          secret: this.setting.appsecret, // AppSecret
          token: this.setting.token, // Token
          aes_key: this.setting.encodingaeskey, // EncodingAESKey
          oauth: {
            // OAuth 配置
            scopes: ['snsapi_userinfo'],
            callback: '/callback'
          }
        }, // 公众号配置
        payment: {
          sandbox: false,
          app_id: this.setting.appid,
          mch_id: this.setting.mch_id,
          key: this.setting.partnerkey,
          cert_path: this.temp_cert, // XXX: 绝对路径！！！！
          key_path: this.temp_key, // XXX: 绝对路径！！！！
          notify_url: this.setting.notify_url // 默认支付结果通知地址
        }, // 微信支付配置
        mini_program: {
          app_id: this.setting.mini_appid,
          secret: this.setting.mini_appsecret
        }, // 小程序配置
        aliyun: {
          key: this.setting.ali_key,
          secret: this.setting.ali_secret,
          sign_name: this.setting.ali_sign_name,
          templat_code: this.setting.ali_templat_code
        }, // 阿里云短信配置
        domain: this.setting.domain, // 域名
        share_domain: this.setting.share_domain, // 分享域名
        template_id: this.setting.template_id, // 微信消息模板id
        service_charge: this.setting.service_charge, // 提现手续费
        pay_type: this.setting.pay_type, // 是否是我们的子商户 支付方式 1--服务商支付，2--普通支付
        can_pay: this.setting.can_pay// 是否开启付款到零钱
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tip-font {
  margin-left: 200px;
}
</style>
