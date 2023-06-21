<template>
  <div class="app-container">
    <complex-table
      :page-name="'文件管理'"
      :has-selection="true"
      :has-search="false"
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      @refreshTable="getPicList"
      @changeMultipleSelection="changeMultipleSelection"
    >
      <!-- 按钮 -->
      <template v-slot:btn>
        <el-button v-has="'UploadsDestroy'" size="medium" type="warning" @click="delSelectPic()">批量删除</el-button>
      </template>
      <!-- 图片预览 -->
      <template v-slot:path="slotProps">
        <div v-if="slotProps.scope.row.type!==1"><img :src="slotProps.scope.row.path" width="60px"></div>
        <span v-else>无</span>
      </template>
      <!-- 操作 -->
      <template v-slot:action="slotProps">
        <el-button
          v-has="'UploadsDestroy'"
          type="warning"
          size="small"
          @click="handleClick(slotProps.scope.row)"
        >删除</el-button>
      </template>
    </complex-table>
  </div>
</template>

<script>
import { deleteArrayById } from '@/utils'

import ComplexTable from '@/components/Table/ComplexTable'

export default {
  name: 'LogPic',
  components: { ComplexTable },
  data() {
    return {
      tableHeader: [
        { prop: 'id', label: 'ID', sortable: true, width: 80 },
        { prop: 'name', label: '文件名称', width: 300 },
        { prop: 'path', label: '图片预览', isCustomize: true },
        { prop: 'size', label: '文件大小' },
        { prop: 'suffix', label: '后缀' },
        { prop: 'created_at', label: '添加时间', width: 160 },
        { prop: 'action', label: '操作', isCustomize: true }
      ],
      pagination: {
        // 当前是第几页
        page: 1,
        // 一页几条
        size: 10,
        // 一共多少页
        total: 100
      },
      tableData: [],
      multipleSelection: []
    }
  },
  watch: {
    formSearch: {
      deep: true,
      handler() {
        this.getPicList()
      }
    }
  },
  created() {
    this.getPicList()
  },
  methods: {
    // 搜索
    search() {
      this.getPicList()
    },
    // 用户列表
    getPicList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else this.initPagination()
      var searchObj = {
        ...this.pagination
      }
      delete searchObj.totaltotal
      this.apiBtn('UploadsIndex', searchObj).then((res) => {
        this.tableData = res.data
        this.pagination.total = res.meta.total
      })
    },
    delSelectPic() {
      if (this.multipleSelection.length === 0) this.$message('请选择图片')
      else {
        var arrId = this.multipleSelection.map((i) => { return i.id })
        this.defalultConfirm('选中图片线上删除后将无法恢复', () => {
          this.apiBtn('UploadsDestroy', { id: arrId })
            .then((res) => {
              this.getPicList()
              this.multipleSelection = []
            })
        })
      }
    },
    handleClick(row) {
      this.defalultConfirm('删除' + row.name, () => {
        this.apiBtn('UploadsDestroy', { id: [row.id] })
          .then((res) => {
            deleteArrayById(this.tableData, row.id)
          })
      })
    },
    changeMultipleSelection(val) {
      this.multipleSelection = val
    },
    changeTime(val) {
      this.formSearch.time = val
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

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
.el-date-editor {
  width: 380px;
}
</style>
