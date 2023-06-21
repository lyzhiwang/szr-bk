<template>
  <div class="app-container">
    <el-row>
      <el-col v-if="review !== 2">
        <div class="top">
          <span>{{ review === 3 ? '信息填写错误，请重新填写' : '首次登录，请先完善账户信息。' }}</span>
          <el-button size="small" type="primary" @click="logout">退出</el-button>
        </div>
        <el-card>
          <div class="card-body">
            <div v-if="stepActive === 0">
              <user-password ref="passwordChild" :form="passwordData" />
            </div>
            <div v-if="stepActive === 1">
              <shop ref="shopChild" :form="baseData" @change="updateForm" />
              <user-base-info ref="baseChild" :form="baseData" />
              <user-nature ref="natureChild" :is-update="false" :form="baseData" @change="updateForm" />
            </div>
            <!-- <div v-if="stepActive===2" class="success-div">
              <i class="el-icon-success" />
              <div>用户信息已完善，{{ time }}秒后将自动跳转至登录页面，重新登录后方可正常使用！</div>
            </div> -->
          </div>
          <div class="card-bottom">
            <el-button v-show="stepActive===0" type="primary" @click="passwordSubmit()">提交</el-button>
            <el-button v-show="stepActive===1" type="primary" @click="baseSubmit()">提交</el-button>
            <!-- <el-button v-show="stepActive===2" type="primary" @click="reload()">点击跳转</el-button> -->
          </div>
        </el-card>
      </el-col>
      <el-col v-else>
        <div class="top">
          您的信息已完善，请点击返回，继续使用。
          <el-button size="small" type="primary" @click="goBack">返回</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Shop from '@/components/Form/Sys/Shop'
import UserBaseInfo from '@/components/Form/Sys/UserBaseInfo'
import UserNature from '@/components/Form/Sys/UserNature'
import UserPassword from '@/components/Form/Sys/UserPassword'

export default {
  name: 'InfoStore',
  components: {
    Shop,
    UserBaseInfo,
    UserNature,
    UserPassword
  },
  data() {
    return {
      stepActive: 0,
      baseData: {
        id: this.$store.getters.userId,
        shop_name: '', // 商家名称
        address: '', // 商家位置
        location: '', // 商家坐标
        service_code: { path: '' }, // 商家二维码
        service_phone: '', // 商家客服电话
        nature: 1,
        idcard_a: { path: '' },
        idcard_b: { path: '' },
        license: { path: '' },
        name: '',
        phone: '',
        two_name: '',
        two_phone: ''
      },
      passwordData: {
        cupassword: '',
        password: '',
        repassword: ''
      },
      time: 5
    }
  },
  computed: {
    ...mapGetters([
      'isReset',
      'review'
    ])
  },
  created() {
    // 获取用户信息 仅驳回可见
    if (this.review === 3) {
      this.apiBtn('AdminShow', { id: this.$store.getters.userId })
        .then((res) => {
          this.baseData = { ...this.baseData, ...res.data }

          var pic = ['service_code', 'license', 'idcard_a', 'idcard_b']
          // 初始化图片格式
          for (const item of pic) {
            this.baseData[item] = {
              id: this.baseData[item],
              path: this.baseData.upload[this.baseData[item]]
            }
          }
          if (!this.baseData.nature) this.baseData.nature = 1
        })
    }
    if (this.isReset === 1) this.stepActive = 0
    else this.stepActive = 1
  },
  methods: {
    // 更新基本信息,开户方信息
    baseSubmit() {
      if (this.$refs.shopChild.validateForm() & this.$refs.baseChild.validateForm() & this.$refs.natureChild.validateForm()) {
        // is_reset 0 不需要修改密码 1 需要修改密码
        var obj = {
          id: this.baseData.id,
          nature: this.baseData.nature,
          idcard_a: this.baseData.idcard_a.id,
          idcard_b: this.baseData.idcard_b.id,
          license: this.baseData.license.id,
          name: this.baseData.name,
          phone: this.baseData.phone,
          two_name: this.baseData.two_name,
          two_phone: this.baseData.two_phone,
          // 商家信息
          shop_name: this.baseData.shop_name,
          address: this.baseData.address,
          location: this.baseData.location,
          service_phone: this.baseData.service_phone,
          service_code: this.baseData.service_code.id,
          is_first: 1
        }
        this.apiBtn('AdminPatch', obj)
          .then((res) => {
            // 完善基本信息 不需要重新登录
            this.$store.commit('user/SET_REVIEW', 1)

            this.$router.push('/')

            // 完善基本信息 重新登录的逻辑
            // this.stepActive = 2
            // // 设定定时器 计时结束跳转页面
            // var i = setInterval(() => {
            //   this.time--
            //   if (this.time === 0) {
            //     clearInterval(i)
            //     this.reload()
            //   }
            // }, 1000)
            // this.$store.commit('user/SET_IS_RESET', 0)
            // this.$store.commit('user/SET_REVIEW', 2)
          })
      }
    },
    // 修改密码
    passwordSubmit() {
      if (this.$refs.passwordChild.validateForm()) {
        this.apiBtn('AdminPatch', {
          id: this.$store.getters.userId,
          cupassword: this.passwordData.cupassword,
          password: this.passwordData.password,
          is_first: 1 })
          .then((res) => {
            // 密码修改成功跳转路由重新登录
            this.stepActive = 1
            this.$store.commit('user/SET_IS_RESET', 0)
          })
        // 清除校验
        this.$refs.passwordChild.clearValidate()
      }
    },
    updateForm(key, val) {
      this.baseData[key] = val
    },
    // reload() {
    //   // 跳转到登录 重新登录
    //   this.$store.dispatch('user/LogOut').then(() => {
    //     location.reload() // 为了重新实例化vue-router对象 避免bug
    //   })
    // },
    logout() {
      this.$store.dispatch('user/LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container,
body {
  height: 100%;
  margin: 0;
  overflow-y: scroll;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
  color: #303133;
  line-height: 45px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .el-button {
    height: 80%;
  }
}
.card-body {
  margin: 20px 0;
}
.card-bottom {
  margin-left: 251px;
}
.success-div {
  text-align: center;
  line-height: 60px;
  letter-spacing: 1px;
  i {
    font-size: 50px;
    color: #409eff;
    margin-top: 20px;
  }
}
</style>

