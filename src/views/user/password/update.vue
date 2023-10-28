<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card class="box-card">
          <user-password ref="passwordChild" :form="passwordData" />
          <el-button
            v-has="'ResetPassword'"
            type="primary"
            style="margin-left:251px"
            @click="passwordSubmit"
          >修改密码</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { setTimeout } from 'timers'

import UserPassword from '@/components/Form/Sys/UserPassword'

export default {
  name: 'Password',
  components: {
    UserPassword
  },
  data() {
    return {
      passwordData: {
        oldPassword: '',
        password: '',
        passwordConfirmation: ''
      }

    }
  },
  methods: {
    // 修改密码
    passwordSubmit() {
      if (this.$refs.passwordChild.validateForm()) {
        this.apiBtn('ResetPassword', {
          old_password: this.passwordData.oldPassword,
          password: this.passwordData.password,
          password_confirmation: this.passwordData.passwordConfirmation })
          .then((res) => {
            // 密码修改成功跳转路由重新登录
            setTimeout(() => {
              // 跳转到登录 重新登录
              this.$store.dispatch('user/LogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            }, 800)
          })
        // 清除校验
        this.$refs.passwordChild.clearValidate()
      }
    }
  }
}
</script>

