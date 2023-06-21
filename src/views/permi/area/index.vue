<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div class="clearfix">
          <span>地区管理</span>
        </div>
      </template>

      <TreeTable :data="areaList" :columns="columns">
        <template v-slot:operation="props">
          <el-button v-show="props.scope.row.children" v-has="'AreaStore'" type="success" size="mini" @click="toggleDialog(props.scope, 'AreaStore')">添加</el-button>
          <el-button v-has="'AreaUpdate'" type="primary" size="mini" @click="toggleDialog(props.scope, 'AreaUpdate')">编辑</el-button>
          <el-button v-has="'AreaDestroy'" type="warning" size="mini" @click="deleteArea(props.scope, 'AreaDestroy')">删除</el-button>
        </template>
      </TreeTable>
    </el-card>
    <!-- 创建、编辑 -->
    <AreaDialog
      :dialog-visible="dialog.visible"
      :area-info="dialog.areaInfo"
      :name="dialog.name"
      @toggleDialog="toggleDialog"
    />
  </div>
</template>

<script>
import TreeTable from '@/components/Table/TreeTable'
import AreaDialog from '@/components/Dialog/AreaDialog'

export default {
  components: { TreeTable, AreaDialog },
  data() {
    return {
      columns: [
        { text: 'ID', value: 'id', width: 160 },
        { text: '地区', value: 'name' },
        { text: '操作', value: 'operation', width: 210, isCustomize: true }
      ],
      dialog: {
        visible: false,
        areaInfo: {},
        name: ''
      }
    }
  },
  computed: {
    areaList: function() {
      return this.$store.state.area.list
    }
  },
  created() {
    this.$store.dispatch('area/GetArea')
  },
  methods: {
    // 删除
    deleteArea(scope, name) {
      this.defalultConfirm('此操作删除该地区', () => {
        const params = {
          scope: scope,
          name: name
        }
        this.$store.dispatch('area/DeleteArea', params)
      })
    },
    // emit事件
    toggleDialog(scope, name) {
      this.dialog = {
        visible: !this.dialog.visible,
        areaInfo: scope ? scope.row : {},
        name: name
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.header {
  margin-bottom: 20px;
  .el-form-item {
    margin-bottom: 0;
  }
}
::v-deep td:last-child .cell {
  display: flex;
  justify-content: space-between;
  .el-button {
    margin: 0;
  }
}
</style>
