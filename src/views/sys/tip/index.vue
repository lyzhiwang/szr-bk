<template>
  <div class="app-container">
    <complex-table :page-name="'系统公告'" :table-header="tableHeader" :table-data="tableData" :pagination="pagination" @refreshTable="getList">
      <!-- 搜索框 -->
      <template v-slot:search>
        <div class="search-row">
          <!-- 选取时间 -->
          <DatePicker :value="formSearch.time" type="date" @changeTime="changeTime" />
          <el-input v-model="otherSearch.keywords" placeholder="请输入公告名称" clearable class="search-item tip-input" @keyup.native.enter="search" @clear="search" />
        </div>
        <div>
          <el-select v-model="formSearch.tag" class="search-item mu-select" multiple filterable placeholder="请选择标签">
            <el-option v-for="item in tagOption" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-button type="primary" icon="el-icon-search" class="search-item" @click="search">搜索</el-button>
        </div>
      </template>
      <template v-slot:btn>
        <el-button v-has="'TipStore'" icon="el-icon-plus" @click="handelRedirect('TipStore')">添加系统公告</el-button>
      </template>
      <template v-slot:time="props">
        {{ props.scope.row.time| parseTime('{y}-{m}-{d}') }}
      </template>
      <!-- 操作 -->
      <template v-slot:action="props">
        <el-button v-has="'TipShow'" type="success" size="small" @click="handelRedirect('TipShow',props.scope.row.id)">查看</el-button>
        <el-button v-has="'TipUpdate'" type="primary" size="small" @click="handelRedirect('TipUpdate',props.scope.row.id)">编辑</el-button>
        <el-button v-has="'TipDestroy'" type="warning" size="small" @click="handleDel(props.scope.row)">删除</el-button>
      </template>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import DatePicker from '@/components/Tool/DatePicker'
import { defalultConfirm, deleteArrayById, toRedirect } from '@/utils'
import { apiBtn } from '@/api/default'

export default {
  name: 'LogPic',
  components: { ComplexTable, DatePicker },
  data() {
    return {
      formSearch: {
        time: '',
        tag: []
      },
      otherSearch: {
        keywords: ''
      },
      tableHeader: [
        { prop: 'id', label: 'ID', sortable: true, width: 80 },
        { prop: 'time', label: '公告时间', width: 120, sortable: true, isCustomize: true },
        { prop: 'title', label: '标题', over: true },
        { prop: 'action', label: '操作', isCustomize: true, width: 220 }
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
      tagOption: []
    }
  },
  watch: {
    formSearch: {
      deep: true,
      handler() {
        this.getList()
      }
    }
  },
  created() {
    this.getList()
    this.getOption()
  },
  methods: {
    // 搜索
    search() {
      this.getList()
    },
    // 系统公告列表
    getList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else this.initPagination()
      apiBtn('TipIndex', { ...this.pagination, ...this.formSearch, ...this.otherSearch })
        .then((res) => {
          this.tableData = res.data
          this.pagination.total = res.meta.total
        })
    },
    initPagination() {
      this.pagination = {
        page: 1,
        size: 10,
        total: 0
      }
    },
    // 获取标签
    getOption() {
      apiBtn('TagIndex').then((res) => {
        this.tagOption = res.data
      })
    },
    // 跳转页面
    handelRedirect(a, id) {
      var obj = {}
      if (id) obj = { id }
      toRedirect(a, obj)
    },
    // 删除
    handleDel(row) {
      defalultConfirm('删除' + row.title + ', 是否继续?', () => {
        apiBtn('TipDestroy', { id: row.id })
          .then((res) => {
            deleteArrayById(this.tableData, row.id)
            this.pagination.total--
          })
      })
    },
    changeTime(val) {
      this.formSearch.time = val
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
.tip-input {
  width: 20%;
}
.search-row {
  width: 60%;
  display: flex;
  justify-content: space-between;
  ::v-deep .el-input:last-child {
    margin:5px 0;
    width: 65% !important;
  }
}
.mu-select {
  width: 60%;
  ::v-deep .el-input {
    width: 100% !important;
  }
}
.search-item {
  margin-right: 15px;
}

</style>
