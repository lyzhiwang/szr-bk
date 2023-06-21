<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="userInfo" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">Admin-template</h3>
      </div>
      <el-form-item prop="username">
        <template #prefix>
          <i class="el-input__icon"><svg-icon icon-class="user" /></i>
        </template>
        <el-input
          ref="username"
          v-model="userInfo.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <template #prefix>
          <i class="el-input__icon"><svg-icon icon-class="password" /></i>
        </template>
        <el-input
          ref="password"
          v-model="userInfo.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="captcha" class="captchaStyle">
        <el-input
          ref="captcha"
          v-model="userInfo.captcha"
          placeholder="请输入验证码"
          @keyup.native.enter="handleLogin"
        >
          <template slot="prefix">
            <img :src="captchaImg" style="height:40px" @click="getCaptcha()">
          </template>
        </el-input>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登&nbsp;录</el-button>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      activeName: 'first',
      userInfo: {
        username: '',
        password: '',
        captcha: '',
        key: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      loading: false,
      passwordType: 'password',
      captchaImg: '',
      // 验证码过期时间
      expired_at: ''
    }
  },
  created() {
    // 初始化验证码
    this.getCaptcha()
  },
  methods: {
    // 获取验证码
    getCaptcha() {
      this.$store.dispatch('user/captcha').then((response) => {
        // console.log(response.data)
        this.captchaImg = response.data.img
        this.expired_at = response.data.expired_at
        this.userInfo.key = response.data.key
      }).catch((error) => {
        console.log(error)
      })
    },
    showPwd() {
      this.passwordType === 'password' ? this.passwordType = '' : this.passwordType = 'password'
    },
    // 切换登录方式
    wxLogin(e) {
      // 微信登录
      this.defalultConfirm('正在使用微信登录, 是否继续?', () => {
        location.replace(this.$store.state.config.wx_login_location)
      }, () => {
        this.activeName = 'first'
      })
    },
    // 登录
    handleLogin() {
      this.checkCaptcha()
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/Login', this.userInfo)
            .then(() => {
              this.loading = false
              // { path: this.redirect ||'/' } 可以重定向到上次退出界面，但是如果权限角色改变，若用户不具备该页面权限，页面为空白
              this.$router.push({ path: '/dashboard' })
            }).catch(() => {
            // 重新获取验证码
              this.getCaptcha()
              this.loading = false
            })
        }
      })
    },
    // 检查验证码是否过期
    checkCaptcha() {
      const myDate = Date.parse(new Date()) // 现在的时间
      var expiredTime = Date.parse(this.expired_at) // expiredTime 过期时间
      if (myDate > expiredTime) {
        this.$message({
          message: '验证码已过期,请重新填写',
          type: 'warning'
        })
        this.getCaptcha()
        this.userInfo.captcha = ''
        // 中函数执行
        throw new Error('验证码已过期')
      }
    }
  }
}
</script>

<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

.captchaStyle {
  ::v-deep .el-input__inner {
    padding-left: 170px;
  }
}
</style>
