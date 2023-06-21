<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-if="jurisdiction('SettingsUpdate')" label="基础设置" name="SettingsUpdate">
          <Basics ref="SettingsUpdate" />
        </el-tab-pane>
        <el-tab-pane v-if="jurisdiction('AllocationUpdate')" label="分配设置" name="AllocationUpdate">
          <Allocation ref="Allocation" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Basics from './components/Basics.vue'
import Allocation from './components/Allocation.vue'

import store from '@/store'
export default {
  components: { Basics, Allocation },
  data() {
    return {
      // activeName: 'SettingsShow'
      activeName: ''
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.getQnToken()
    if (this.jurisdiction('SettingsUpdate')) {
      this.activeName = 'SettingsUpdate'
    } else if (this.jurisdiction('AllocationUpdate')) {
      this.activeName = 'AllocationUpdate'
    }
  },
  methods: {
    // 点击切换
    handleClick(tab, event) {
      this.$refs[tab.name].getDetail()
    },

    // 权限判定
    jurisdiction(value) {
      const permissionBtn = store.getters.permissionBtn // 权限按钮列表
      const permisssion = permissionBtn[value] // 当前按钮的权限
      if (permisssion && permisssion.api && permisssion.method) return true
      else return false
    },

    // 获取七牛token
    getQnToken() {
      const config = this.$store.state.config
      if (!config.imgToken) {
        this.$store.dispatch('config/GetQiniuToken')
      }
    }
  }
}
</script>
