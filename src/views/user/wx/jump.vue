<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      :label-position="$store.state.app.labelPosition"
      label-width="100px"
      class="form"
      @submit.native.prevent
    >
      <el-form-item label="登录密码" prop="pwd">
        <el-input v-model="form.pwd" type="password" placeholder="请输入密码，用于绑定微信号的二次验证" />
      </el-form-item>
      <div style="margin-left:100px;">
        <p class="tip-font">* 绑定微信号需要输入用户后台登录密码用于二次验证。</p>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">确认绑定</el-button>
        <el-button @click="router.push('/user/wx')">取消绑定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { authback } from '@/api/definite'
export default {
  data() {
    return {
      form: { pwd: '' },
      state: this.$route.query.state,
      code: this.$route.query.code,
      formRules: {
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (!this.state || !this.code) {
      this.$router.push('/user/wx')
      this.$message('用户授权失败!')
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 向后台发送code 返回用户是否绑定成功
          authback({ state: this.state, code: this.code, pwd: this.form.pwd })
            .then(res => {
              if (res.message === 'Server Error') this.$message('该页面已过期!')
              this.$router.push('/user/wx')
            }).catch(() => {
              this.$router.push('/user/wx')
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

