<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">

      <el-dropdown v-show="operator_service||market_service" class="service-container" trigger="click">
        <div class="right-menu-item">
          <div class="flex-center">
            <img src="@/assets/icon_service.png" class="service-code">
            <span class="text-blue">联系客服</span>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <div class="service-dropdown">
              <div class="flex-center service-dropdown-tab">
                <div v-if="operator_service" :class="activeName===1?'text-blue':'text-default'" @click="handleClick(1)">操作客服</div>
                <div v-if="market_service" :class="activeName===2?'text-blue':'text-default'" @click="handleClick(2)">市场客服</div>
              </div>
              <div class="service-dropdown-content">
                <div>
                  <img :src="service.code" class="service-code">
                  <div class="text-center text-gray">微信名片</div>
                </div>
                <div class="right">
                  <div>客服专员:{{ service.name }}</div>
                  <div>电话:{{ service.phone }}</div>
                </div>
              </div>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-tooltip content="返回" effect="dark" placement="bottom">
        <div class="back right-menu-item" @click="$router.go(-1)">
          <svg-icon icon-class="back" />
        </div>
      </el-tooltip>
      <el-tooltip content="清理缓存并刷新当前页面" effect="dark" placement="bottom">
        <div class="refresh right-menu-item" @click="clearStorage">
          <svg-icon icon-class="refresh" />
        </div>
      </el-tooltip>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <span class="right-menu-item">{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link v-for="item in dropdown" :key="item.to" :to="item.to" class="inlineBlock">
              <el-dropdown-item>{{ item.label }}</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      activeName: 1,
      service: {}
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'roles'
    ]),
    ...mapState({
      operator_service: state => state.user.operator_service,
      market_service: state => state.user.market_service
    }),
    dropdown() {
      var menu = [
        { to: '/user/password', label: '修改密码' },
        { to: '/user/wx', label: '微信绑定' }
      ]
      var info = [
        { to: '/user/info', label: '个人信息' }
      ]
      if ([1, 5, 7, 8, 9].includes(this.roles[0])) {
        return info.concat(menu)
      }
      return menu
    }
  },
  created() {
    // 初始化客服信息
    if (this.operator_service) {
      this.service = this.operator_service
      this.activeName = 1
    } else if (this.market_service) {
      this.service = this.market_service
      this.activeName = 2
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/LogOut')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 清除前后台缓存
    clearStorage() {
      const msg = '此操作将清除所有缓存, 并刷新当前页面,是否继续？'
      const callBack = () => {
        sessionStorage.clear()
        localStorage.clear()
        this.apiBtn('CommonClear')
          .then(res => {
            this.refreshUserInfo()
          })
      }
      this.defalultConfirm(msg, callBack)
    },
    refreshUserInfo() {
      this.$store.dispatch('user/getInfo')
        .then(res => {
          // 拉取用户信息
          const roles = res.data.roles
          const permission = res.data.permission
          const btn = res.data.btn
          this.$store.dispatch('permission/GenerateRoutes', { roles, permission, btn })
            .then(res => { // 根据roles权限生成可访问的路由表
              this.refreshPage()
            })
        })
        .catch(() => {
          this.$store.dispatch('user/resetToken')
        })
    },
    // 刷新
    refreshPage() {
      const page = this.$route
      this.$store.dispatch('tagsView/delCachedView', page).then(() => {
        const { fullPath } = page
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    handleClick(type) {
      this.activeName = type
      switch (type) {
        case 1:
          this.service = this.operator_service
          break
        case 2:
          this.service = this.market_service
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      // font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      cursor: pointer;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
  .service-container{
    .right-menu-item{
      cursor: pointer;
      .flex-center{
        height: 100%;
        display: flex;
        align-items: center;
        img{
          margin-right: 5px;
        }
      }
    }
    .text-blue{
      color: #3395FC;
      }

  }
}

::v-deep{
  .service-dropdown{
    width: 300px;
    font-size: 14px;
    &-tab{

      cursor: pointer;
      .text-blue{
        color: #3395FC;
        padding: 10px 0;
        border-bottom: 2px solid #3395FC;
      }
      .text-default{
        color: #999999;
        padding: 10px 0;
        border-bottom: 2px solid #fff;
      }

    }
    &-content{
      padding: 15px;
      line-height: 30px;
      color: #333333;
      display: flex;
      justify-content: space-around;
      .right{
        margin-top: 20px;
      }

    }
    .flex-center{
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .text-center{
      text-align: center;
    }
    .service-code{
      width: 100px;
    }
    .text-gray{
      color: #999999;
    }

  }
}
</style>
