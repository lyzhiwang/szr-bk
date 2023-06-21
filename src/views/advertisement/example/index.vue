<template>
  <div class="app-container">
    <ComplexTable
      :has-search="false"
      :has-pagination="false"
      :table-header="tableHeader"
      :table-data="tableData"
      page-name="霸屏示例"
      @refreshTable="getList"
    >

      <template v-slot:btn>
        <div class="select-box">
          <el-button v-has="'ExampleStore'" icon="el-icon-plus" @click="isVisible = true">添加示例</el-button>
        </div>
      </template>

      <template v-slot:path="props">
        <img class="img" :src="props.scope.row.path.path">
      </template>

      <!-- 操作 -->
      <template v-slot:operation="props">
        <div class="btn-box">
          <el-button v-has="'ExampleUpdate'" type="primary" size="small" @click="edit(props.scope.row)">编辑</el-button>
          <el-button v-has="'ExampleDestroy'" type="danger" size="small" @click="del('ExampleDestroy', props.scope.row)">删除</el-button>
        </div>
      </template>
    </ComplexTable>

    <example-dialog :form="checkedRow" :is-visible="isVisible" @close="colseDialog" @success="getList" />

  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import ExampleDialog from '@/components/Dialog/ExampleDialog'

export default {
  components: { ComplexTable, ExampleDialog },
  data() {
    return {
      tableHeader: [
        { prop: 'id', label: 'ID', width: 70, sortable: true },
        { prop: 'name', label: '名称' },
        { prop: 'path', label: '图片', isCustomize: true },
        { prop: 'operation', label: '操作', width: 210, isCustomize: true }
      ],
      tableData: [],
      isVisible: false,
      checkedRow: {
        name: '',
        path: ''
      }
    }
  },
  watch: {
  },
  created() {
    this.getList()
  },
  methods: {
    edit(row) {
      this.checkedRow = row
      this.isVisible = true
    },
    colseDialog() {
      this.isVisible = false
      this.checkedRow = {
        name: '',
        path: { path: '' }
      }
    },
    // 删除
    del(name, row) {
      const msg = '此操作将永久删除' + row.name
      const callBack = () => {
        this.apiBtn(name, { id: row.id })
          .then(res => {
            this.tableData.splice(this.tableData.indexOf(row), 1)
          })
      }
      this.defalultConfirm(msg, callBack)
    },
    // 普通查找
    search() {
      this.getList()
    },
    getList() {
      this.apiBtn('ExampleIndex').then(res => {
        this.tableData = res.data.list
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.img{
  width: 100px
}
</style>
