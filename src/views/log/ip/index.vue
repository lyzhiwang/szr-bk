<template>
  <div class="app-container">
    <complex-table
      :page-name="'ip名单管理'"
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      @refreshTable="getList"
    >
      <!-- 搜索框 -->
      <template v-slot:search>
        <el-select v-model="formSearch.type" placeholder="请选择类型" clearable>
          <el-option v-for="(title,val) in typeOption " :key="'type1'+val" :label="title" :value="val" />
        </el-select>
        <el-input
          v-model="otherSearch.ip"
          placeholder="IP"
          clearable
          class="search-item"
          @keyup.native.enter="search"
          @clear="search"
        />
        <el-button type="primary" icon="el-icon-search" class="search-item" @click="search">搜索</el-button>
      </template>
      <!-- 添加按钮 -->
      <template slot="btn">
        <div v-has="'IpStore'" class="box-add">
          <el-input v-model="form.ip" placeholder="请输入IP" class="input-with-select">
            <el-select slot="prepend" v-model="form.type" placeholder="请选择类型">
              <el-option v-for="(title,val) in typeOption " :key="'type2'+val" :label="title" :value="val" />
            </el-select>
            <el-button slot="append" @click="handelAdd">添加</el-button>
          </el-input>
        </div>
      </template>
      <!-- add_time -->
      <template v-slot:add_time="props">
        <span>{{ props.scope.row.add_time| parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template v-slot:type="props">
        <span>{{ typeOption[props.scope.row.type] }}</span>
      </template>
      <template v-slot:action="props">
        <el-button
          v-has="'IpDestroy'"
          type="warning"
          size="small"
          @click="handelDel(props.scope.row)"
        >删除</el-button>
        <el-button
          v-show="props.scope.row.type===1"
          v-has="'IpRelieve'"
          type="danger"
          size="small"
          @click="ipRelieve(props.scope.row)"
        >解封</el-button>
      </template>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'

export default {
  name: 'LogLogin',
  components: { ComplexTable },
  data() {
    return {
      formSearch: {
        type: ''
      },
      otherSearch: {
        ip: ''
      },
      form: {
        type: '',
        ip: ''
      },
      tableHeader: [
        { prop: 'id', label: 'ID', sortable: true, width: 80 },
        { prop: 'type', label: '类型', isCustomize: true },
        { prop: 'ip', label: 'IP' },
        { prop: 'add_time', label: '创建时间', isCustomize: true },
        { prop: 'create_admin_user_id', label: '创建人' },
        { prop: 'action', label: '操作', isCustomize: true }
      ],
      typeOption: {
        1: '黑名单',
        2: '白名单'
      },
      pagination: {
        // 当前是第几页
        page: 1,
        // 一页几条
        size: 10,
        // 一共多少页
        total: 100
      },
      tableData: []
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
    this.getList()
  },
  methods: {
    // 搜索
    search() {
      this.getList()
    },
    getList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else this.initPagination()
      this.apiBtn('IpIndex', { ...this.pagination, ...this.formSearch, ...this.otherSearch })
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
    },
    handelDel(row) {
      this.defalultConfirm('删除IP：' + row.ip, () => {
        this.apiBtn('IpDestroy', { id: row.id })
          .then((res) => {
            this.getList()
          })
      })
    },
    handelAdd() {
      if (!this.form.ip || !this.form.type) {
        this.$message('请先选择，类型并填写IP')
        return
      }
      this.apiBtn('IpStore', { ...this.form })
        .then((res) => {
          this.getList()
          this.form.ip = ''
        })
    },
    // 解封用户
    ipRelieve(row) {
      this.defalultConfirm('解封IP：' + row.ip + '下所有用户', () => {
        this.apiBtn('IpRelieve', { ip: row.ip })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-date-editor {
  width: 380px;
}

.box-add{
  .el-input{
    width: 100%;
  }
  ::v-deep.el-select{
    width: 120px;
    .el-input{
      width: 100%;
    }
  }
}
</style>
