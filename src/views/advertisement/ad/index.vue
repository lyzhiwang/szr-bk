<template>
  <div class="app-container">
    <ComplexTable :table-header="tableHeader" :table-data="tableData" :pagination="pagination" page-name="霸屏广告" @refreshTable="getList">
      <!-- 搜索框 -->
      <template v-slot:search>
        <el-input v-model="formSearch.keywords" placeholder="请输入广告名称|广告链接" clearable @keyup.native.enter="search" @clear="getList" />
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </template>

      <template v-slot:btn>
        <div class="select-box">
          <el-button v-has="'ExampleStore'" type="primary" icon="el-icon-connection" @click="toRedirect('AdExample')">霸屏示例</el-button>

          <el-button v-has="'AdStore'" icon="el-icon-plus" @click="isVisible = true">添加广告</el-button>
        </div>
      </template>

      <!-- 操作 -->
      <template v-slot:operation="props">
        <div class="btn-box">
          <el-button v-has="'AdUpdate'" type="primary" size="small" @click="edit(props.scope.row)">编辑</el-button>
          <el-button v-has="'AdDestroy'" type="danger" size="small" @click="del('AdDestroy', props.scope.row)">删除</el-button>
          <el-button v-has="'AdSetting'" :disabled="$store.state.user.userId!==props.scope.row.admin_id" :type="props.scope.row.is_default?'warning':'default'" size="small" @click="setting('AdSetting', props.scope.row)">{{ props.scope.row.is_default?'默认广告':'设为默认' }}</el-button>
        </div>
      </template>
    </ComplexTable>

    <ad-dialog :form="checkedRow" :is-visible="isVisible" @close="closeDialog" @success="getList" />

  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import AdDialog from '@/components/Dialog/AdDialog'

export default {
  name: 'Ad',
  components: { ComplexTable, AdDialog },
  data() {
    return {
      formSearch: {
        keywords: ''
      },
      tableData: [],
      pagination: {
        page: 1, // 当前页数
        size: 10, // 每页显示条目个数
        total: 0
      },
      isVisible: false,
      checkedRow: {
        link_name: '',
        path: ''
      }
    }
  },
  computed: {
    tableHeader() {
      var obj = [
        { prop: 'id', label: 'ID', width: 70, sortable: true },
        { prop: 'link_name', label: '名称' },
        { prop: 'path', label: '链接' },
        { prop: 'admin_id', label: '创建人', width: 100 },
        { prop: 'operation', label: '操作', isCustomize: true }
      ]
      if (![1, 5, 6].includes(this.$store.state.user.roles[0])) obj.splice(3, 1)
      return obj
    }
  },
  created() {
    this.getList()
  },
  methods: {
    edit(row) {
      this.checkedRow = row
      this.isVisible = true
    },
    closeDialog() {
      this.isVisible = false
      this.checkedRow = {
        link_name: '',
        path: ''
      }
    },
    // 删除
    del(name, row) {
      const msg = '此操作将永久删除' + row.link_name
      const callBack = () => {
        this.apiBtn(name, { id: row.id })
          .then(res => {
            this.tableData.splice(this.tableData.indexOf(row), 1)
          })
      }
      this.defalultConfirm(msg, callBack)
    },
    setting(name, row) {
      if (row.is_default) return
      this.apiBtn(name, { id: row.id, is_default: 1 })
        .then(res => {
          this.getList()
        })
    },
    // 普通查找
    search() {
      this.getList()
    },
    getList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else this.initPagination()
      this.apiBtn('AdIndex', { ...this.pagination, ...this.formSearch }).then(res => {
        this.tableData = res.data.list
        this.pagination.total = res.data.total
      })
    },
    initPagination() {
      this.pagination = {
        page: 1,
        size: 10,
        total: 0
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
