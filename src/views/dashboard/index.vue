<template>
  <div class="app-container">
    <tip title="数据概览" />

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="18">
        <PanelGroup :list="Statistics" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { apiBtn } from '@/api/default.js'
import PanelGroup from './components/PanelGroup'
export default {
  name: 'Dashboard',
  components: { PanelGroup },
  data() {
    return {
      panel_list: [],
      statisticsdata: {
        account: 65, // 账号数量
        duration: 2104, // 视频时长 秒
        end_time: null, // 到期时间
        total_duration: 4236, // 总持续时间
        username: 'admin', // 用户名
        voice_number: 99// 语音次数
      }
    }
  },
  computed: {
    Statistics() {
      if (this.statisticsdata) {
        var arr = [
          {
            title: '账号数量',
            icon: 'activity',
            type: 'activity',
            value: this.statisticsdata.account
          },
          {
            title: '视频时长',
            icon: 'pageviews',
            type: 'pageviews',
            value: this.statisticsdata.duration
          },
          {
            title: '总持续时间',
            icon: 'exposure',
            type: 'exposure',
            value: this.statisticsdata.total_duration
          }
        ]
      }

      return arr
    }
  },

  created() {
    this.getlist()
  },
  mounted() {
  },
  methods: {
    // 获取列表数据
    getlist() {
      apiBtn('Dashboard').then((res) => {
        // console.log('获取列表数据')
        // console.log(res)
        // this.statisticsdata = res.data
      })
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
