<template>
  <div class="app-container">
    <complex-table
      :page-name="'登录日志'"
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      @refreshTable="getLogList"
    >
      <!-- 搜索框 -->
      <template v-slot:search>
        <!-- 选取时间 -->
        <DatePicker
          :value="formSearch.time"
          :has-shortcuts="true"
          :disabled-type="2"
          value-format="timestamp"
          @changeTime="changeTime"
        />
        <el-input
          v-model="otherSearch.keywords"
          placeholder="用户ID|用户名|备注"
          clearable
          class="search-item"
          @keyup.native.enter="search"
          @clear="search"
        />
        <el-button type="primary" icon="el-icon-search" class="search-item" @click="search">搜索</el-button>
      </template>
      <!-- lastlogintime -->
      <template v-slot:lastlogintime="props">
        <span>{{ props.scope.row.lastlogintime| parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <!-- 用户名 -->
      <template v-slot:user="props">
        <span>{{ props.scope.row.user.userName }}</span>
      </template>
      <!-- 登录方式 -->
      <template v-slot:type="props">
        <span>{{ typeOption[props.scope.row.type] }}</span>
      </template>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import DatePicker from '@/components/Tool/DatePicker'

export default {
  name: 'LogLogin',
  components: { ComplexTable, DatePicker },
  data() {
    return {
      formSearch: {
        time: []
      },
      otherSearch: {
        keywords: ''
      },
      tableHeader: [
        { prop: 'id', label: 'ID', sortable: true, width: 80 },
        { prop: 'userId', label: '用户ID' },
        { prop: 'user', label: '用户名', isCustomize: true },
        { prop: 'ip', label: 'IP' },
        { prop: 'lastlogintime', label: '登陆时间', width: 300, isCustomize: true },
        { prop: 'type', label: '登录方式', isCustomize: true }
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
      typeOption: {
        1: '密码登录',
        2: '微信登录'
      }
    }
  },
  watch: {
    formSearch: {
      deep: true,
      handler() {
        this.search()
      }
    }
  },
  created() {
    this.getLogList()
  },
  methods: {
    // 搜索
    search() {
      this.getLogList()
    },
    // 用户列表
    getLogList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else this.initPagination()
      this.apiBtn('LoginIndex', { ...this.pagination, ...this.formSearch, ...this.otherSearch })
        .then((res) => {
          this.tableData = res.data.list
          this.pagination.total = res.data.total
        })
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

<style scoped>
.el-date-editor {
  width: 380px;
}
</style>
