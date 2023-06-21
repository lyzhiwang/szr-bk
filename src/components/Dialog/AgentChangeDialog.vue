<template>
  <el-dialog :visible.sync="currentVisible" :close-on-click-modal="false" :fullscreen="$store.state.app.device === 'mobile' ? true : false" title="转移门店归属" width="500px" center :before-close="toggleDialog">
    <div v-has="'AgentInfoIndex'">
      <el-input v-model="keywords" placeholder="请输入完整的输入代理商id或者代理商名称" prefix-icon="el-icon-search" @keyup.native.enter="search">
        <el-button slot="append" icon="el-icon-search" @click="search" />
      </el-input>
    </div>
    <div v-if="agentInfo" class="agent">
      <div class="agent-content">
        <div>
          id：{{ agentInfo.id }}
        </div>
        <div>
          用户名：{{ agentInfo.username }}
        </div>
        <div>
          地区：{{ agentInfo.area_id | areaFilter }}
        </div>
        <div>
          备注：{{ agentInfo.remark }}
        </div>
      </div>
    </div>
    <div v-show="showTip" class="text-red">搜索不到该代理商</div>

    <template v-slot:footer>
      <el-popover
        v-model="visible"
        placement="top"
        width="160"
      >
        <p v-if="agentInfo && agentInfo.id">即将转移{{ store[0].username }}等{{ storeList.length }}个门店至{{ agentInfo.username }}代理商，确认转移吗？</p>
        <p v-else>请先确认代理商</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="submit">确定</el-button>
        </div>
        <el-button slot="reference" v-has="'AgentMigrate'" type="primary">确认转移</el-button>
      </el-popover>

      <el-button @click="toggleDialog()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    store: {
      type: Array,
      default() {}
    }
  },
  data() {
    return {
      visible: false,
      currentVisible: false,
      keywords: '',
      agentInfo: null,
      agent: '',
      showTip: false
    }
  },
  computed: {
    storeList() {
      const arr = []
      for (const item of this.store) {
        arr.push(item.id)
      }
      return arr
    }
  },
  watch: {
    isVisible(val) {
      this.currentVisible = val
    }
  },
  methods: {
    submit() {
      this.visible = false
      if (!this.agentInfo && !this.agentInfo.id) return
      this.apiBtn('AgentMigrate', { agent_id: this.agentInfo.id, store: this.storeList })
        .then(res => {
          this.toggleDialog()
          this.$emit('success')
        })
    },
    // 查询代理商
    search() {
      if (!this.keywords) {
        this.$message('请输入完整的输入代理商id或者代理商名称')
        return
      }
      this.apiBtn('AgentInfoIndex', { keywords: this.keywords })
        .then(res => {
          this.agentInfo = res.data
          if (!this.agentInfo) this.showTip = true
          else {
            this.showTip = false
            this.agent = this.agentInfo.id
          }
        })
    },
    toggleDialog() {
      this.currentVisible = false
      this.keywords = ''
      this.showTip = false
      this.agentInfo = null
      this.$emit('close', '')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-input{
  width:100%;
}
.text-red{
  color: #f44336;
  line-height: 30px
}
.agent{
    width: 100%;
    line-height: 30px;
    margin-top: 30px;
    color: #555;
    font-weight: 600;
    &-content{
      background: #fafafb;
      padding: 10px 20px;
    }
}
</style>
