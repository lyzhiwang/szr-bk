<template>
  <div class="app-container">
    <el-card class="box-card">
      <h2>{{ tip.title }}</h2>
      <article v-html="tip.content" />
      <!-- <footer>
        <p>洛阳智网网络科技有限公司</p>
        <p>卡惠生活运营团队</p>
        <p>{{ system.name }}</p>
        <p>{{ tip.time | parseTime('{y}-{m}-{d}') }}</p>
      </footer> -->
    </el-card>
  </div>
</template>

<script>
import { apiBtn } from '@/api/default'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      tip: {
        id: this.$route.query.id,
        title: '',
        content: '',
        time: new Date()
      }
    }
  },
  computed: {
    ...mapState({
      system: state => state.user.system
    })
  },
  created() {
    if (this.tip.id) {
      apiBtn('TipShow', { id: this.tip.id })
        .then((res) => {
          this.tip = { ...this.tip, ...res.data }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .box-card {
    padding: 20px 40px;
    h2 {
      font-weight: 500;
      text-align: center;
      letter-spacing: 1px;
    }
    article {
      line-height: 30px;
      margin: 30px 0;
    }
    footer {
      text-align: right;
    }
  }
}
</style>
<style>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
