<template>
  <div />
</template>

<script>
import { callback } from '@/api/definite'
import { setToken } from '@/utils/auth'

export default {
  created() {
    if (this.$route.query.state) {
      if (this.$route.query.code) {
        // 向后台发送code 返回用户是否登录成功
        callback({ state: this.$route.query.state, code: this.$route.query.code })
          .then(res => {
            if (res.message === 'Server Error') this.$message('该页面已过期!')
            else {
              setToken(res.data.token)
              this.$store.commit('user/SET_TOKEN', res.data.token)
              this.$store.commit('user/SET_IS_RESET', res.data.isReset)
              this.$store.commit('user/SET_REVIEW', res.data.review)
            }
            this.$router.push('/')
          }).catch(() => {
            this.$router.push('/')
          })
      } else {
        this.$router.push('/')
        this.$message('用户授权失败!')
      }
    }
  }
}
</script>
