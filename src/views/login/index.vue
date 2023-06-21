<template>
  <div class="login-container">
    <div class="login-tab">
      <el-row :gutter="80">
        <el-col :xs="0" :sm="12">
          <div class="login-pic">
            <img src="@/assets/login/poster.png">
          </div>
        </el-col>
        <el-col :xs="24" :sm="12">
          <div class="login-content">
            <div class="title">数字人系统后台管理</div>
            <el-form ref="userInfo" :model="userInfo" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
              <el-form-item prop="username">
                <el-input v-model="userInfo.username" placeholder="账号" @keyup.native.enter="handleLogin">
                  <template #prefix>
                    <i class="el-input__icon"><img src="@/assets/login/icon_accouont.png"></i>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="password">
                <div class="pwd-box">
                  <el-input v-model="userInfo.password" :type="pwdType" placeholder="密码" show-password @keyup.native.enter="handleLogin">
                    <template #prefix>
                      <i class="el-input__icon"><img src="@/assets/login/icon_password.png"></i>
                    </template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item prop="captcha" class="captcha-content">
                <el-input ref="captcha" v-model="userInfo.captcha" placeholder="请输入验证码" @keyup.native.enter="handleLogin">
                  <template #prefix>
                    <i class="el-input__icon"><img src="@/assets/login/icon_code.png"></i>
                  </template>
                  <template #suffix>
                    <img class="code" :src="captchaImg" @click="getCaptcha()">
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item class="btn-div">
                <el-button :loading="loading" type="primary" round @click.native.prevent="handleLogin">登&nbsp;录</el-button>
              </el-form-item>
            </el-form>
            <!-- <div class="weixin-div">
              <div class="weixin-title">
                <span class="line" />
                <span>微信登录</span>
                <span class="line" />
              </div>
              <div>
                <img src="@/assets/login/weixin.png" alt="" srcset="" @click="wxLogin">
              </div>
            </div> -->
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- <div class="logo">
      <img src="@/assets/login/logo.png">
    </div> -->
  </div>
</template>

<script>
// 引入二次提示框
// import { defalultConfirm } from '@/utils'

export default {
  name: 'Login',
  data() {
    return {
      // userInfo: {
      //   username: '',
      //   password: '',
      //   captcha: ''
      // },
      // code: {
      //   key: '',
      //   img: ''
      // },
      // loginRules: {
      //   username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
      //   password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
      //   captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      // },
      // loading: false,
      pwdType: 'password',

      activeName: 'first',
      userInfo: {
        username: '',
        password: '',
        captcha: '',
        // type: 1, // 1后台2桌面端
        // oemid: 1,
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
    // this.refreshCaptchas()
    // 初始化验证码
    this.getCaptcha()
  },
  methods: {
    // refreshCaptchas() {
    //   this.$store.dispatch('user/getCaptchas')
    //     .then(res => {
    //       this.code = res
    //     })
    // },

    // 获取验证码
    getCaptcha() {
      this.$store.dispatch('user/captcha').then((response) => {
        this.captchaImg = response.data.img
        this.expired_at = response.data.expired_at
        this.userInfo.key = response.data.key
      }).catch((error) => {
        console.log(error)
      })
    },

    //
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
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
      this.$refs.userInfo.validate(valid => {
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

<style lang="scss" scoped>
@import "@/styles/variables.scss";

body {
  overflow: hidden;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  width: 100%;
  height: 100%;
  @extend .flex;
  box-sizing: border-box;
  background: url('~@/assets/login/bg.png');
  background-size: cover;
  background-position: center;

    .el-row{
      margin: 0 !important;
    }

    .login-tab{
      width: 75%;
      max-width: 1000px;
      background: #fff;
      border-radius: 10px;
      padding: 80px 0;
    }

    .login-pic img{
      width:100%;
    }

    .login-content{
      .title{
        font-size: 22px;
        color: #333333;
        letter-spacing: 2px;
        font-weight: 400;
        margin-bottom: 20px;
      }
    }

  .login-form {
    ::v-deep .el-input__prefix{
      left: 0;
    }
    .el-form-item {
      width: 100%;
      margin: 0 auto 20px;
      .el-input {
        width: 100%;
        input {
          height: 50px;
        }
        ::v-deep .el-input__inner{
          padding-left: 25px;
          border-radius: 0;
          border: none;
          border-bottom: 1px solid #DCDFE6;
        }
        .el-input__icon{
          line-height: 48px;
          img{
            width: 18px;
            height: auto;
          }
        }
      }
      .el-button {
        width: 50%;
        max-width: 250px;
        background:linear-gradient(90deg,rgba(96,148,251,1) 0%,rgba(136,138,250,1) 100%);
        box-shadow:0px 7px 27px 2px rgba(82,132,242,0.21);
      }
    }
    .code{
      display: block;
      height: 30px;
    }
    .btn-div{
      text-align: center;
      margin-top: 30px;
    }
  }

  .weixin-div {
    text-align: center;
    .weixin-title{
      @extend .flex;
      justify-content: space-between;
      color: #777777;
      font-size: 10px;
      margin: 10px 0;
      .line{
        width: 30%;
        height: 1px;
        background: #DCDFE6;
        opacity: 0.5;
      }
    }
    img{
      width: 25px;
      cursor: pointer;
    }
  }

  ::v-deep .el-input__prefix{
    color: $mainColor;
  }

  .logo{
    width:100%;
    text-align: center;
    position: fixed;
    bottom: 20px;
  }
}
</style>
